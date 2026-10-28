// Profile form → project teams. Run by .github/workflows/form-sync.yml every night at 00:00
// Sri Lanka time, or by hand ("Run workflow").
//
// Reads the same Google Form response sheet as marc_people (CSV link in FORM_RESPONSES_CSV, from the GOOGLE_FORM_CSV_LINK secret). For
// every response that ticked projects, adds the person's email to projectMembers in each project
// they are not already on, and opens one pull request on branch profile-form/<id>-projects.
// A response whose pull request exists (open, merged or closed) is never proposed again.
// Setup: google-form/README.md in marc_people.
//
// Try it locally without git or GitHub (changes are written to the working tree):
//   DRY_RUN=1 FORM_RESPONSES_CSV=path/to/responses.csv node scripts/form-sync.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

// Question titles: keep in step with google-form/questions.json in marc_people.
const Q = {
  timestamp: "Timestamp",
  submitter: "Email address",
  email: "Your main email address",
  name: "Your name, as it should appear on the website",
  projects: "Projects you work on as a researcher",
};
const DRY = process.env.DRY_RUN === "1";
const PROJECTS = path.join(process.cwd(), "projects");

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

async function readSource(source) {
  if (!/^https?:\/\//.test(source)) return fs.readFileSync(source, "utf8");
  const res = await fetch(source, { redirect: "follow", headers: { "Cache-Control": "no-cache" } });
  const text = await res.text();
  if (!res.ok || /^\s*<(!doctype|html)/i.test(text)) {
    throw new Error(`Could not read the response sheet (${res.status}). Is it shared as "Anyone with the link"?`);
  }
  return text;
}

/** RFC 4180 CSV → objects keyed by the (trimmed) header row. Same as marc_people/scripts/form-sync.mjs. */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  text = text.replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  const [header = [], ...data] = rows;
  return data
    .filter((r) => r.some((v) => v.trim()))
    .map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

const answer = (row, title) => {
  const key = Object.keys(row).find((k) => k.toLowerCase() === title.toLowerCase());
  return key ? row[key] : "";
};

/** Same id as in marc_people, so both pull requests of one response can be matched up. */
const responseId = (row) =>
  crypto
    .createHash("sha1")
    .update([answer(row, Q.timestamp), answer(row, Q.submitter), answer(row, Q.email)].join("|").toLowerCase())
    .digest("hex")
    .slice(0, 10);

/** Inserts `  - email` into projectMembers (replacing `[]`), keeping the rest of the file as it is. */
export function addMember(raw, email) {
  const crlf = /\r\n/.test(raw);
  const bom = raw.startsWith("﻿") ? "﻿" : "";
  const lines = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n").split("\n");
  const end = lines[0] === "---" ? lines.indexOf("---", 1) : -1;
  if (end < 0) return null;
  const i = lines.findIndex((l, n) => n > 0 && n < end && /^projectMembers:/.test(l));
  if (i < 0) return null;
  if (/^projectMembers:\s*\[\s*\]\s*$/.test(lines[i])) {
    lines.splice(i, 1, "projectMembers:", `  - ${email}`);
  } else {
    let j = i + 1;
    while (j < end && /^\s*-\s/.test(lines[j])) j++;
    // Indent like the existing items (files differ: one space, two spaces or none).
    const indent = j > i + 1 ? lines[i + 1].match(/^\s*/)[0] : "  ";
    lines.splice(j, 0, `${indent}- ${email}`);
  }
  return bom + lines.join(crlf ? "\r\n" : "\n");
}

/** Adds the response's email to the ticked projects. Returns the projects changed. */
export function applyResponse(row) {
  const email = String(answer(row, Q.email)).trim().toLowerCase();
  const ticked = answer(row, Q.projects);
  if (!email || !ticked) return [];
  const projects = fs
    .readdirSync(PROJECTS)
    .filter((f) => /\.md$/i.test(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(PROJECTS, file), "utf8");
      return { file, raw, data: matter(raw).data };
    });
  const changed = [];
  for (const p of projects) {
    // Match by the full title, so titles containing commas still work.
    if (!p.data.project || !ticked.includes(String(p.data.project))) continue;
    const team = [...(p.data.projectMembers ?? []), ...(p.data.supervisors ?? [])].map((x) => String(x).toLowerCase());
    if (team.includes(email)) continue;
    const updated = addMember(p.raw, email);
    if (!updated) continue;
    fs.writeFileSync(path.join(PROJECTS, p.file), updated);
    changed.push(p);
  }
  return changed;
}

function handledIds() {
  const ids = new Set();
  const add = (s) => {
    const m = String(s).match(/profile-form\/([0-9a-f]{10})-projects\b/);
    if (m) ids.add(m[1]);
  };
  JSON.parse(run("gh", ["pr", "list", "--state", "all", "--limit", "1000", "--json", "headRefName"])).forEach((p) => add(p.headRefName));
  run("git", ["ls-remote", "--heads", "origin", "profile-form/*"]).split("\n").forEach(add);
  return ids;
}

function validate() {
  try {
    run("node", ["scripts/validate-projects.mjs"]);
    return { ok: true, output: "" };
  } catch (err) {
    return { ok: false, output: `${err.stdout || ""}${err.stderr || ""}`.trim() };
  }
}

async function main() {
  const source = process.env.FORM_RESPONSES_CSV;
  if (!source) {
    console.log("FORM_RESPONSES_CSV is not set: nothing to do.");
    return;
  }
  const rows = parseCsv(await readSource(source));
  const handled = DRY ? new Set() : handledIds();

  for (const row of rows) {
    const id = responseId(row);
    if (handled.has(id)) continue;
    const branch = `profile-form/${id}-projects`;
    if (!DRY) {
      run("git", ["reset", "--hard"]);
      run("git", ["checkout", "-B", branch, "origin/main"]);
    }
    const changed = applyResponse(row);
    if (!changed.length) continue; // nothing ticked, or already on every ticked project
    const email = String(answer(row, Q.email)).trim().toLowerCase();
    const name = String(answer(row, Q.name)).trim() || email;
    const check = validate();
    console.log(`${id}: add ${email} to ${changed.map((p) => p.file).join(", ")}; validator ${check.ok ? "passed" : "failed"}`);
    if (DRY) continue;

    run("git", ["add", "-A", "projects"]);
    run("git", ["commit", "-m", `Add ${name} to project teams (profile form ${id})`]);
    run("git", ["push", "-u", "origin", branch]);
    const body = [
      `Submitted through the MARC profile form (response \`${id}\`; the profile itself is a pull request in marc_people).`,
      "",
      `Adds \`${email}\` to \`projectMembers\` in:`,
      ...changed.map((p) => `- ${p.data.project} (\`projects/${p.file}\`)`),
      "",
      `- **Submitted from:** ${answer(row, Q.submitter) || "(no email collected)"}`,
      `- **Validator:** ${check.ok ? "✅ passed" : "❌ failed"}`,
      check.ok ? null : "\n```\n" + check.output + "\n```",
      "",
      "- [ ] This person really works on these projects.",
      "",
      "Merge to publish, or close to reject (this response won't be proposed again).",
    ]
      .filter((l) => l !== null)
      .join("\n");
    const bodyFile = path.join(os.tmpdir(), `form-sync-${process.pid}.md`);
    fs.writeFileSync(bodyFile, body);
    try {
      run("gh", ["pr", "create", "--base", "main", "--head", branch, "--title", `Add ${name} to project teams`, "--body-file", bodyFile, ...(check.ok ? [] : ["--draft"])]);
    } finally {
      fs.rmSync(bodyFile, { force: true });
    }
  }
  if (!DRY) {
    run("git", ["reset", "--hard"]);
    run("git", ["checkout", "-f", "main"]);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
}
