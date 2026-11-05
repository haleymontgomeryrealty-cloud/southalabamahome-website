# southalabamahome.com

Website for Montgomery & Co. (Haley Montgomery, broker), South Alabama.

Static site served from `dist/`. `node build-seo.cjs` prerenders each page with titles, canonicals, structured data, sitemap and robots.txt for `SITE_URL` (default https://southalabamahome.com). Render runs this on deploy (see `render.yaml`) and deploys automatically on every push to `main`.

Checks: `node check-seo.cjs`, `node --check dist/app.js`, `node --check dist/stewart.js`.
