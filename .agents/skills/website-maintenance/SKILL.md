---
name: website-maintenance
description: >-
  Guides maintenance, content updates, Tailwind styling builds, responsive layout checks,
  and deployment for this personal portfolio website (nikpatil.com / nikhilpatil12.github.io).
  Use whenever updating projects, experience, resume links, styling, or preparing deployments.
---

# Website Maintenance Skill

Standard operating procedures for maintaining and updating the **nikpatil.com** personal portfolio site.

## Architecture Overview

- **Core Page**: [index.html](file:///Users/nikhil/Developer/nikhilpatil12.github.io/index.html) (Single-page portfolio).
- **Styling**: Tailwind CSS v4.
  - Source styles / theme: [styles/raw.css](file:///Users/nikhil/Developer/nikhilpatil12.github.io/styles/raw.css)
  - Compiled distribution: [styles/styles.css](file:///Users/nikhil/Developer/nikhilpatil12.github.io/styles/styles.css) (linked in `index.html`)
- **Scripts**: [scripts/script.js](file:///Users/nikhil/Developer/nikhilpatil12.github.io/scripts/script.js) (three.js canvas, navigation, interactions)
- **Deployment**: Automatic GitHub Actions workflow ([jekyll-gh-pages.yml](file:///Users/nikhil/Developer/nikhilpatil12.github.io/.github/workflows/jekyll-gh-pages.yml)) triggered on push to `master`. Custom domain configured via [CNAME](file:///Users/nikhil/Developer/nikhilpatil12.github.io/CNAME) (`www.nikpatil.com`).

---

## Standard Workflows

### 1. Modifying Styles & UI Classes
Whenever adding Tailwind utility classes to [index.html](file:///Users/nikhil/Developer/nikhilpatil12.github.io/index.html) or modifying custom CSS in [styles/raw.css](file:///Users/nikhil/Developer/nikhilpatil12.github.io/styles/raw.css), you **must recompile the CSS bundle**:

```bash
# Build minified CSS for production:
npm run build:css

# Or run watch mode during active multi-step editing:
npm run watch:css
```

> [!IMPORTANT]
> The GitHub Pages deployment serves [styles/styles.css](file:///Users/nikhil/Developer/nikhilpatil12.github.io/styles/styles.css). Never commit changes to `index.html` or `styles/raw.css` without building and staging `styles/styles.css`.

---

### 2. Updating Portfolio Content

- **Work Experience**: Located in the `#experience` section of [index.html](file:///Users/nikhil/Developer/nikhilpatil12.github.io/index.html). Follow the existing tab and panel structure (`data-tab-target` / job detail divs).
- **Featured Projects**: Located in the `#projects` section of [index.html](file:///Users/nikhil/Developer/nikhilpatil12.github.io/index.html). Ensure project links (GitHub repo, demo URLs, tech stack tags) follow the current card formatting.
- **Resume Updates**:
  1. Add/replace the resume PDF in the repository root (e.g., `Nikhil Patil Resume.pdf`).
  2. Verify all `<a href="...">` links pointing to the resume in [index.html](file:///Users/nikhil/Developer/nikhilpatil12.github.io/index.html) match the new filename exactly.

---

### 3. Mobile & Responsive Guidelines

When making layout or design changes, agents must strictly follow these mobile guidelines:

- **Breakpoints**:
  - **Mobile (`< 576px`)**: Full-width `#divMain`, hamburger menu button visible (`block sm:hidden`), 3D Three.js canvas mouse listeners disabled.
  - **Tablet / Landscape (`sm: 576px+` / `md: 768px+`)**: Sidebar visible, project cards display side-by-side with preview graphics.
  - **Desktop (`lg: 992px+` / `xl: 1200px+`)**: Compact sidebar (`w-1/12`), expanded content margins.
- **Touch Targets & Interaction**:
  - All buttons, nav links, tab buttons, and social icons must have at least a **44×44px** touch area (e.g. `p-2.5` or `min-h-[44px] min-w-[44px]`).
  - On mobile, opening the navigation overlay (`openNav()`) must allow smooth closing upon selecting any section link (`closeNav()`).
- **Horizontal Overflow & Typography**:
  - Prevent horizontal scrollbars on mobile: ensure wide containers use `max-w-full`, `overflow-hidden`, and long text strings use `break-words`.
  - Adjust font sizes on small viewports so headers do not awkwardly wrap.
- **Performance on Mobile**:
  - Lazy-load project images (`loading="lazy"`).
  - Keep 3D canvas resource-friendly and respect `prefers-reduced-motion`.

---

### 4. Local Verification & Auditing

Before committing:
1. **Preview Locally**:
   ```bash
   python3 -m http.server 8000
   ```
2. **Visual & Responsive Testing**:
   - Check layout on mobile screens (`< 640px`), tablets, and desktops.
   - Use `chrome-devtools` or `a11y-debugging` tools to check for console errors or broken resource links.
3. **Verify Links**: Ensure external links have `rel="noopener noreferrer"` and internal anchors (`#about`, `#experience`, `#projects`, `#contact`) scroll smoothly.

---

### 5. Git Deployment Workflow

1. Ensure the working tree has the recompiled CSS:
   ```bash
   git status
   ```
2. Stage all related files (including compiled assets):
   ```bash
   git add index.html styles/styles.css styles/raw.css package.json
   ```
3. Commit with a concise descriptive message:
   ```bash
   git commit -m "feat: update experience section and rebuild css"
   ```
4. Push to origin `master`:
   ```bash
   git push origin master
   ```
   GitHub Actions will automatically run the Pages workflow and deploy to `www.nikpatil.com`.
