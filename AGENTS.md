# AGENTS.md - Developer & Agent Safety Rules

## Project Scope & Integrity
This repository contains a high-value portfolio website (`index.html`, `style.css`, `script.js`, `assets/`).
All automated agents, assistants, and scripts operating within this repository must adhere to the following safety protocols:

### 1. Zero Destructive Overwrites
- Do not overwrite full files when performing localized modifications or adding features.
- Always use targeted diffs or precise replacement tools.
- Never clear, blank out, or truncate source files.

### 2. Regression Prevention & Code Preservation
- Preserve existing interactive components: dynamic background canvas, interactive terminal simulator, filtering systems, responsive nav menu, and animations.
- Preserve all existing CSS custom properties (design tokens) and visual themes.
- Preserve document metadata: title, description, SEO tags, OpenGraph metadata, and Google Fonts links.
- Preserve all comments and structural documentation.

### 3. Asset Protection (`assets/`)
- Do not delete, rename, or blindly overwrite any visual assets in the `assets/` directory (`avatar.jpg`, `project-*.jpg`, etc.).

### 4. Terminal Command Safeguards
- Destructive commands (e.g. `rm`, `Remove-Item`, wiping directories) are strictly prohibited without explicit user confirmation.

### 5. Sensitive Data & Security
- Never insert credentials, API tokens, or secrets into client-side code.
- Keep environment and secret files excluded from version control and backups.
