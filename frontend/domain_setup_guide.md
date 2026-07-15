# Deployment & Custom Domain Setup Guide

This guide compiles the options and steps we discussed for hosting the **Running Journey** project and securing a neat, free URL for it later.

---

## 1. Project Overview & Assessment
* **Concept:** A personal running journey tracking website mapping raw GPX logs (94 activities) to a cinematic visual storyline.
* **Tech Stack:** React 19, Vite, TailwindCSS, Framer Motion, and Recharts.
* **Rating:** **9.5/10**. The integration of real-world GPX data combined with a premium dark-mode cinematic theme makes it a highly engaging personal showcase.

---

## 2. Recommended Hosting Platforms (Alternatives to GitHub Pages)
To host the site for free with better speed and clean URL routing:

1. **Vercel (Recommended):**
   * Automatically deploys on git push.
   * Free SSL certificate.
   * Serves files at the root of the domain (e.g. `yourname.vercel.app` instead of `username.github.io/repo-name`).
2. **Cloudflare Pages:**
   * World-class performance, speed, and security.
   * Simple integration with GitHub.
3. **Netlify:**
   * Drag-and-drop deployment or Git integration.

---

## 3. How to Setup a Free Domain/Subdomain Later

### Option A: Customizing Vercel Subdomain (Instant & Free)
When you deploy on Vercel:
1. Go to your **Vercel Dashboard** -> Click your project.
2. Go to **Settings** -> **Domains**.
3. Edit the domain to something clean like `mohithruns.vercel.app` or `runningjourney.vercel.app`.

---

### Option B: Community Free Domain via `is-a.dev`
You can claim a free `yourname.is-a.dev` domain name (e.g. `mohith.is-a.dev` or `runs.is-a.dev`).

#### Steps to register:
1. Deploy your app first to a free host like Vercel to get a working link (e.g., `your-project.vercel.app`).
2. Visit the registration repository on GitHub: [github.com/is-a-dev/register](https://github.com/is-a-dev/register).
3. Fork their repository.
4. Create a new file in their `domains/` folder named `yourchoice.json` (e.g., `mohith.json`).
5. Copy the configuration template below into the file:

```json
{
  "name": "mohith",
  "description": "Personal running journey portfolio and analytics dashboard",
  "owner": {
    "username": "YourGitHubUsername",
    "email": "your-email@example.com"
  },
  "record": {
    "CNAME": "your-project.vercel.app"
  }
}
```
6. Open a Pull Request (PR) to merge your fork back to their main repository.
7. Once approved, `yourchoice.is-a.dev` will link directly to your Vercel deployment!

---

### Option C: Student Custom Domain (1 Year Free TLD)
If you have a student/college email ID:
1. Apply for the **[GitHub Student Developer Pack](https://education.github.com/pack)**.
2. Claim a free 1-year custom domain name (like `.me`, `.tech`, or `.live`) through Namecheap or Name.com.
3. Link it to Vercel/Netlify for free.
