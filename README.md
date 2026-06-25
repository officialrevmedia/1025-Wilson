# 1025 Wilson

**A premium commercial marketing website.**
For-sale commercial units at 1025 Wilson Street West, Ancaster, Ontario.
Delivered by Elite Developments.

Live at: [1025wilson.ca](https://1025wilson.ca)

---

## What's in this repo

- `index.html` - the complete, standalone marketing site
- `og.jpg` - social share image referenced by the Open Graph and Twitter tags (keep it at the repo root so `https://1025wilson.ca/og.jpg` resolves)
- `404.html` - branded not-found page
- `CNAME` - custom domain (1025wilson.ca)
- `robots.txt` / `sitemap.xml` - search indexing
- `.gitignore`

All images, logos, the favicon, styles, JavaScript, and the interactive map are bundled inside `index.html`. No build step, no dependencies, no assets folder. The only file that lives outside `index.html` is `og.jpg`, used purely for link previews on social and messaging apps.

External resources loaded at runtime:
- Google Fonts (Cormorant Garamond, Inter, Barlow Condensed)
- Leaflet 1.9.4 + CARTO tiles (interactive neighbourhood map)

---

## This revision

- **Flexible Uses section:** rebuilt with six images, one per use, each captioned to match the list (Medical & Surgical, Professional Office, Financial & Legal, Dental & Wellness, Ground-Floor Retail, Invest & Lease). On desktop the six sit in a two-by-three gallery beside the use ledger; on mobile they stack two-up beneath it.
- **Menu logo:** enlarged for stronger presence in the navigation (54px on desktop, 44px on mobile), legible in both the transparent and scrolled states.
- **Mobile pass:** verified at 390px. No horizontal overflow, the hero scrim keeps the light text readable over the rendering, and the new gallery and captions render cleanly.
- `og.jpg` regenerated from the hero rendering at 1200x675.

---

## Deploying to GitHub Pages

1. Commit `index.html`, `og.jpg`, `CNAME`, `404.html`, `robots.txt`, `sitemap.xml`, and `.gitignore` to the repository root under the `officialrevmedia` account.
2. **Settings -> Pages -> Source:** Deploy from a branch -> `main` -> `/ (root)` -> **Save**.
3. Confirm the custom domain shows `1025wilson.ca` and that HTTPS is enforced.
4. Keep `og.jpg` at the root so link previews render correctly.

DNS at the registrar:

```
A      @    185.199.108.153
A      @    185.199.109.153
A      @    185.199.110.153
A      @    185.199.111.153
CNAME  www  officialrevmedia.github.io
```

## Updating later
- **Brochure:** link the Brochure button by searching `id="brochureBtn"` in `index.html` and giving the anchor an `href` to the PDF.
- **Uses imagery:** the six use photos live in the `uses-figs` block in `index.html`. Replace any `<img>` source in that block to swap a photo.

---

## Contact

- **Elite Developments** - Burlington, Ontario
- **Sales** - sales@elitedevelopments.com
- **Web** - [elitedevelopments.com](https://www.elitedevelopments.com)

© 2026 Elite Wilson Holdings Inc. All Rights Reserved.
