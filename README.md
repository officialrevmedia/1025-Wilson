# 1025 Wilson

**A premium commercial marketing website.**
For-sale commercial units at 1025 Wilson Street West, Ancaster, Ontario.
Delivered by Elite Developments.

🌐 Live at: [1025wilson.ca](https://1025wilson.ca) *(after DNS points here)*

---

## What's in this repo

- **`index.html`** — the complete, standalone marketing site (~5.2 MB)

That's it. All images, logos, styles, JavaScript, and the interactive map are bundled inside `index.html`. There are no build steps, no dependencies to install, no assets folder to manage.

External CDN resources loaded at runtime:
- Google Fonts (Cormorant Garamond, Inter, Barlow Condensed)
- Leaflet 1.9.4 (interactive neighbourhood map)
- CARTO map tiles (for the map base layer)

---

## Deploy to GitHub Pages (5 minutes)

GitHub Pages is free and perfect for this site.

### Step 1 — Create the GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it `1025-wilson` (or anything — the repo name matters only for the default URL)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we have one)
5. Click **Create repository**

### Step 2 — Upload the files

Easiest path (browser only, no git needed):

1. On the new repo page, click **uploading an existing file**
2. Drag `index.html` and `README.md` into the browser
3. Scroll down, click **Commit changes**

Via git command line:

```bash
cd /path/to/1025-wilson
git init
git add .
git commit -m "Initial launch"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/1025-wilson.git
git push -u origin main
```

### Step 3 — Turn on GitHub Pages

1. In your repo, click **Settings** (top nav)
2. Left sidebar, click **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Under **Branch**, pick **main** and **/ (root)**
5. Click **Save**
6. Wait 1–2 minutes. GitHub will show a green banner: *"Your site is live at https://YOUR-USERNAME.github.io/1025-wilson/"*

Done. The site is live.

### Step 4 (optional) — Custom domain (1025wilson.ca)

If you own `1025wilson.ca`:

1. At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add these DNS records:

   **For apex domain (1025wilson.ca):**
   ```
   Type   Name   Value
   A      @      185.199.108.153
   A      @      185.199.109.153
   A      @      185.199.110.153
   A      @      185.199.111.153
   ```

   **For www subdomain:**
   ```
   Type   Name   Value
   CNAME  www    YOUR-USERNAME.github.io
   ```

2. Back in the GitHub repo **Settings → Pages**, under **Custom domain**, enter `1025wilson.ca` and click **Save**
3. Check **Enforce HTTPS** once it's available (takes ~15 min after DNS propagates)

DNS changes can take up to 24 hours to propagate worldwide but usually work within 30 minutes.

---

## Alternative: Vercel (also free, also 5 minutes)

If you prefer Vercel:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `1025-wilson` repo
4. Framework Preset: **Other** (it's plain HTML)
5. Click **Deploy**

Vercel auto-detects `index.html` and hosts it. Custom domains are managed under **Project → Settings → Domains**.

---

## Alternative: Netlify (also free)

1. Go to [netlify.com](https://app.netlify.com/drop)
2. Drag the entire folder (or just `index.html`) into the drop zone
3. That's it. It's live on a `*.netlify.app` URL.

---

## Updating the site later

Any edit can be made directly in GitHub's web editor:

1. Open `index.html` in your repo
2. Click the pencil icon (top-right)
3. Make your changes
4. Scroll down, click **Commit changes**

GitHub Pages will rebuild automatically in 1–2 minutes.

For larger revisions (new imagery, layout changes), get Claude to produce a fresh `index.html` and replace the file.

---

## File size note

The site is ~5.2 MB because every rendering, logo, and photograph is embedded as base64 directly in the HTML. This means:

- ✅ The site works offline after the first load
- ✅ No missing images, no broken links, no CDN failures
- ✅ One file is the whole site — easy to email, archive, or move
- ⚠️ Initial page load is heavier than a site with external images

For a marketing site this is an intentional tradeoff. Buyers and agents will usually only load this once; from that point on, everything is cached.

If you want to reduce the initial load, the next iteration could split images into a `/images/` folder with `<img src="...">` references. That change is cheap to make when needed.

---

## Contact

- **Elite Developments** — Burlington, Ontario
- **Sales & Marketing** — ahmad.mirza@elitedevelopments.com
- **Web** — [elitedevelopments.com](https://www.elitedevelopments.com)

---

© 2026 Elite Wilson Holdings Inc. All Rights Reserved.
