import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const repoRoot = process.cwd();
const allowedResearchAreas = [
  "Biomedical Engineering and Wearables",
  "Computer Vision",
  "Generative AI",
  "Multispectral Imaging",
  "Smart Grid",
  "Socioeconomic",
];

const nonEmptyString = z.string().trim().min(1);
const frontmatterSchema = z
  .object({
    project: nonEmptyString,
    projectMembers: z.array(nonEmptyString),
    supervisors: z.array(nonEmptyString),
    researchArea: z.enum(allowedResearchAreas),
    researchPillars: z.array(nonEmptyString),
    coverImage: nonEmptyString,
  })
  .strict();

const markdownFiles = fs
  .readdirSync(repoRoot, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isFile() &&
      entry.name.toLowerCase().endsWith(".md") &&
      entry.name.toLowerCase() !== "readme.md",
  )
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b));

const failures = [];
const seenProjects = new Map();

for (const fileName of markdownFiles) {
  const filePath = path.join(repoRoot, fileName);
  const raw = fs.readFileSync(filePath, "utf8");

  let parsed;
  try {
    parsed = matter(raw);
  } catch (error) {
    failures.push(`${fileName}: could not parse front matter (${error.message})`);
    continue;
  }

  const result = frontmatterSchema.safeParse(parsed.data);
  if (!result.success) {
    for (const issue of result.error.issues) {
      const issuePath = issue.path.length > 0 ? issue.path.join(".") : "frontmatter";
      failures.push(`${fileName}: ${issuePath} ${issue.message}`);
    }
    continue;
  }

  const data = result.data;
  const normalizedProject = data.project.toLowerCase();

  if (seenProjects.has(normalizedProject)) {
    failures.push(
      `${fileName}: duplicate project name "${data.project}" also used in ${seenProjects.get(normalizedProject)}`,
    );
  } else {
    seenProjects.set(normalizedProject, fileName);
  }

  if (!data.coverImage.startsWith("./cover_images/")) {
    failures.push(
      `${fileName}: coverImage must use a repo-relative path starting with "./cover_images/"`,
    );
  }

  const coverImagePath = path.resolve(path.dirname(filePath), data.coverImage);
  if (!fs.existsSync(coverImagePath)) {
    failures.push(`${fileName}: cover image not found at ${data.coverImage}`);
  }
}

if (markdownFiles.length === 0) {
  failures.push("No project markdown files were found.");
}

if (failures.length > 0) {
  console.error("marc_projects validation failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Validated ${markdownFiles.length} project file(s) successfully.`);
