# marc_projects

:wave: This repository stores the project entries that are pulled into the MARC website during deployment.

If your pull request is merged here, the website workflow will clone this repository into the website build, and your project can appear on the live site.

## :sparkles: What you will add

You will usually add:
- one Markdown file for your project
- one cover image inside `cover_images/`

A typical project file looks like this:

```md
---
project: "Example Project"
projectMembers:
  - person1@example.com
  - person2@example.com
supervisors:
  - supervisor@example.com
researchArea: Computer Vision
researchPillars:
  - "AI in Engineering"
  - "AI in Climate Change"
coverImage: ./cover_images/example_project.jpg
---
Write the project description here in Markdown.
```

The text below the front matter becomes the main project description on the project page.

## :bookmark_tabs: Fields used by the website

The website currently validates each project entry with these fields:
- `project`: project title
- `projectMembers`: list of strings
- `supervisors`: list of strings
- `researchArea`: string
- `researchPillars`: list of strings
- `coverImage`: image path

All of these fields are required by the current website schema.

## :warning: Important linking rule for supervisors and project members

The website tries to match `projectMembers` and `supervisors` against the `email` values stored in the `marc_people` repository.

That means:
- if a supervisor or project member is already in `marc_people`, it is better to use their email address
- when you use that same email, the website can automatically link to their people profile and show their name and photo
- if the person is not in `marc_people`, you can put their name, email, or any other text you want
- if the value does not match a `marc_people` email, the website will still display that text, but it will not become a linked people profile

In practice, use email addresses when you want automatic linking to the people page. Otherwise, plain names are fine.

## :brain: Before you start

You should have:
- a GitHub account
- basic familiarity with editing files and committing changes
- the project title, members, supervisors, research area, research pillars, and a cover image ready

## :triangular_ruler: YAML front matter basics

The block between the top `---` line and the next `---` line is YAML front matter.

This is where the website reads your project metadata.

A few YAML gotchas to watch for:
- indentation matters; use consistent spaces before list items
- do not use tabs for indentation
- every field name must be followed by a colon, like `project:`
- list items must start with `-`
- if a value contains special characters, a colon, or you just want to be safe, wrap it in quotes
- do not forget the closing `---` line before your normal Markdown description starts
- the image path must match the actual file name exactly

Good example:

```yaml
projectMembers:
  - person1@example.com
  - person2@example.com
```

Common mistake:

```yaml
projectMembers:
- person1@example.com
 - person2@example.com
```

The second example is easy to break because the indentation is inconsistent.

## :memo: What you can write in the content section

Everything below the closing `---` line is normal Markdown content.

For projects, this is the main project description. You can include:
- plain paragraphs
- section headings
- bullet lists
- links
- emphasis such as bold or italic text
- images using Markdown syntax

Example:

```md
---
project: "Example Project"
projectMembers:
  - person1@example.com
supervisors:
  - supervisor@example.com
researchArea: Computer Vision
researchPillars:
  - "AI in Engineering"
coverImage: ./cover_images/example_project.jpg
---
This project focuses on robust image analysis for real-world environments.

## Objectives

- Build better models
- Evaluate them on real data
- Publish results

More details can be linked here: [Project page](https://example.com).

Here is an inline image:
![Example figure](./cover_images/example_project.jpg)
```

If you include an image in the content section, use a relative path to a file inside the repository. The image can be placed at any place inside the repo (You don't need to place it in the cover_images folder, in fact don't place them there!)

Keep it reasonably simple and readable. Plain paragraphs are completely fine.

## :label: Allowed research areas

The `researchArea` value should exactly match one of the research area page titles in the website.

Use one of these exact values, including capitalization:
- `Biomedical Engineering and Wearables`
- `Computer Vision`
- `Generative AI`
- `Multispectral Imaging`
- `Smart Grid`
- `Socioeconomic`

If the capitalization or wording does not match, the website data becomes inconsistent. Use the values above exactly.

## :pushpin: Research pillars

`researchPillars` is a list of strings.

Examples already used in the repository include:
- `AI in Engineering`
- `AI in Climate Change`

There is no hardcoded validation list for research pillars in the current website schema, but you should keep the wording consistent with existing values when possible.

## :globe_with_meridians: Option A: Edit using the GitHub website

This is the easiest option if you do not want to use Git locally.

### 1. Fork the repository

1. Open `pdnMARC/marc_projects` on GitHub.
2. Click `Fork`.
3. Create the fork under your own GitHub account.

### 2. Create your project file in the browser

1. Open your fork on GitHub.
2. In the repository root, click `Add file`.
3. Choose `Create new file`.
4. Name the file something clear, for example:

```text
Example_Project.md
```

5. Paste your project content.

Example:

```md
---
project: "Example Project"
projectMembers:
  - person1@example.com
  - person2@example.com
supervisors:
  - supervisor@example.com
researchArea: Computer Vision
researchPillars:
  - "AI in Engineering"
coverImage: ./cover_images/example_project.jpg
---
This project studies ...
```

### 3. Add your cover image in the browser

1. Open the `cover_images/` folder in your fork.
2. Click `Add file`.
3. Choose `Upload files`.
4. Upload your image.
5. Make sure the `coverImage` field matches the uploaded file name exactly.

Example:

```md
coverImage: ./cover_images/example_project.jpg
```

Notes:
- The cover image is required by the current website schema.
- Common formats such as `.jpg`, `.jpeg`, and `.png` are appropriate.
- Keep the file name simple to avoid path mistakes.

### 4. Edit an existing project on GitHub

If you already have a project entry and just want to update it:

1. Open the existing `.md` file in your fork.
2. Click the pencil icon to edit it.
3. Update the front matter or description.
4. If needed, upload a new image to `cover_images/`.
5. Scroll down and commit the change to a new branch.
6. Open a pull request.

You can manage both new projects and later updates entirely from the GitHub website this way.

### 5. Commit your changes on GitHub

When editing in the browser:

1. Scroll to the commit section below the editor.
2. Enter a short commit message such as `Add project Example Project`.
3. Choose `Create a new branch for this commit and start a pull request` if GitHub offers it.
4. Click `Propose changes` or `Commit changes`.

### 6. Open a pull request

1. GitHub will usually guide you to a pull request page.
2. Open a pull request from your fork to `pdnMARC/marc_projects:main`.
3. Briefly say that you are adding or updating a project.

## :computer: Option B: Edit locally with Git

Use this option if you prefer working on your own machine.

### 1. Fork the repository

1. Open the `pdnMARC/marc_projects` repository on GitHub.
2. Click `Fork`.
3. Create the fork under your own GitHub account.

### 2. Clone your fork

```bash
git clone https://github.com/<your-github-username>/marc_projects.git
cd marc_projects
```

### 3. Create a branch

```bash
git checkout -b add-my-project
```

Use any clear branch name such as `add-example-project`.

### 4. Add your project file

Create a new Markdown file in the repository root.

Example:

```text
Example_Project.md
```

Then add your YAML front matter and project description.

Example:

```md
---
project: "Example Project"
projectMembers:
  - person1@example.com
  - person2@example.com
supervisors:
  - supervisor@example.com
researchArea: Computer Vision
researchPillars:
  - "AI in Engineering"
coverImage: ./cover_images/example_project.jpg
---
This project studies ...
```

### 5. Add your cover image

Put the image file inside the `cover_images/` folder and reference it in `coverImage`.

Example:

```md
coverImage: ./cover_images/example_project.jpg
```

### 6. Commit and push

```bash
git add .
git commit -m "Add project Example Project"
git push origin add-my-project
```

### 7. Open a pull request

1. Go to your fork on GitHub.
2. Open a pull request from your branch to `pdnMARC/marc_projects:main`.
3. In the pull request description, briefly state that you are adding or updating a project.

## :arrows_counterclockwise: How the website uses this repository

The MARC website GitHub Actions workflow clones `pdnMARC/marc_projects` into the website build as the projects collection.

That is why project changes belong in this repository rather than directly in the website repository.

In practice, the flow is:
1. You update `marc_projects`.
2. Your pull request is merged.
3. The website workflow pulls this repository during deployment.
4. Your project becomes part of the website build.

## :white_check_mark: Checklist before opening the pull request

- Your Markdown file is in the repository root.
- Your front matter includes all required fields.
- Your YAML indentation is consistent and uses spaces, not tabs.
- Your `projectMembers` list is written as a YAML list.
- Your `supervisors` list is written as a YAML list.
- Your `researchArea` exactly matches one of the allowed values above, including capitalization.
- Your `coverImage` path is correct.
- Your cover image file is inside `cover_images/`.
- Use email addresses in `projectMembers` and `supervisors` when you want automatic linking to the people page.
- Plain names or other text are also allowed, but they will display as plain text if they do not match a `marc_people` email.
- Your project description is below the closing `---` line.