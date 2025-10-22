# Pixel Quilt – zero-code deploy guide

## 1) What this is
A ready-to-deploy web app that turns a photo into a quilt pattern (squares/hex), maps to fabric palettes, and lets you download a ZIP (SVG + PNG).

## 2) Local preview (optional)
- You can skip this if you just want to deploy. Otherwise you need Node 18+.
```
pnpm i    # or npm i / yarn
pnpm dev  # opens http://localhost:3000
```

## 3) Deploy
**Recommended:** Vercel + GitHub
1. Create a GitHub account and make a new empty repository.
2. Upload these files (drag the contents of this folder into GitHub’s web UI).
3. Go to vercel.com → New Project → Import from GitHub → select your repo → Deploy.
4. After deploy: add your subdomain `pattern.yourdomain.com` in Vercel → Domains and add the CNAME at your DNS host.

**Embed:** 
```html
<iframe src="https://pattern.yourdomain.com" style="width:100%;height:90vh;border:0;"></iframe>
```

## 4) Next steps
- Expand `src/lib/palettes.ts` with full Kona/Bella palettes.
- Improve PDF (currently a placeholder) using pdf-lib.
- Add color swap UI.
