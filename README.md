# The Wilson Centre — 1025wilson.ca

Static marketing site for The Wilson Centre (1025 Wilson Street West, Ancaster), by Elite Developments. Hosted on GitHub Pages.

## Deployment

Upload **all files in this folder to the root** of the GitHub Pages repository, replacing existing files. GitHub Pages serves them automatically. No build step.

The `CNAME` file maps the site to `1025wilson.ca` — leave it in place. In the repo Settings → Pages, ensure the custom domain shows `1025wilson.ca` and "Enforce HTTPS" is on.

## File manifest

| File | Purpose |
|------|---------|
| `index.html` | The full website (self-contained; all imagery embedded) |
| `404.html` | Branded not-found page (GitHub Pages serves it automatically) |
| `The-Wilson-Centre-eBrochure.pdf` | Web brochure — linked from the nav "Brochure" button and footer |
| `og.jpg` | Social share image (1200×675), referenced by Open Graph / Twitter meta |
| `favicon.ico` | Legacy multi-size favicon |
| `favicon-16/32/48/180/192/512.png` | Modern PNG favicons + Apple touch icon |
| `maskable-192/512.png` | Android maskable PWA icons |
| `site.webmanifest` | PWA manifest (name, icons, theme colour) |
| `robots.txt` | Allows all crawlers; points to the sitemap |
| `sitemap.xml` | Sitemap for search engines |
| `CNAME` | Custom domain binding for GitHub Pages |
| `.nojekyll` | Tells GitHub Pages to skip Jekyll processing (serves files as-is) |

## SEO already in place (in `index.html` `<head>`)

- Title, meta description, keywords, author, robots
- Canonical URL `https://1025wilson.ca/`
- Open Graph (title, description, url, image + alt + type, locale, site_name)
- Twitter Card (summary_large_image)
- Geo meta (region, placename, coordinates, ICBM)
- `theme-color`, `format-detection`
- Two JSON-LD blocks: `RealEstateListing` and a graph of `Organization` + `WebSite` + `Place`

## Notes

- After deploying, submit `https://1025wilson.ca/sitemap.xml` in Google Search Console.
- If you change the OG image, keep it at `/og.jpg` (1200×675) or update the meta tags.
- The registration forms open a pre-filled email to the sales team (mailto). No backend required.
