# GUNERY × Grupo Médico — Video Marketing Pipeline & Portal

Interactive Production Hub, Content Calendar, Teleprompter & Client Collaboration Platform.

---

## 🚀 One-Step Deployment to Vercel (`gm.gunery.com`)

### Option A: Using Vercel CLI (Fastest)

1. Open your terminal in this directory:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts:
   - **Scope:** Select `gunerycom`
   - **Link to existing project?** `No`
   - **Project Name:** `gm-gunery-pipeline`
   - **Directory:** `./`
3. Deploy directly to production:
   ```bash
   npx vercel --prod
   ```
4. **Assign Subdomain (`gm.gunery.com`)**:
   - In your Vercel Dashboard, go to **Project Settings ➔ Domains**.
   - Add `gm.gunery.com`.
   - Ensure your DNS has a `CNAME` for `gm` pointing to `cname.vercel-dns.com`.

---

### Option B: Using GitHub / GitLab / Bitbucket

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: GM x Gunery Pipeline"
   git remote add origin https://github.com/gunerycom/gm-pipeline.git
   git push -u origin main
   ```
2. In [vercel.com](https://vercel.com), click **"Add New Project"** and import the repository.
3. Under **Domains**, add `gm.gunery.com`.

---

## 🔒 Security & Audio Permissions

The included [`vercel.json`](./vercel.json) automatically enforces:
- **`Permissions-Policy: microphone=(self)`** — Ensures iOS Safari, Android Chrome, and Desktop browsers grant secure microphone access for Dr. Mario's voiceover recordings.
- **HTTPS & Cache-Control** headers for fast asset loading.
