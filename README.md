# Rush Radiology Mock (Next.js + Tailwind)

Local dev setup:

```bash
# 1) Install Node 18+ (https://nodejs.org/)
node -v

# 2) Install deps
npm install

# 3) Add your hero video in the public folder:
#    Place your file at: public/Warm MRI Experience.mp4
#    (the code already points to "/Warm%20MRI%20Experience.mp4"
#     or rename your file to public/broll.mp4 and update src/app/page.tsx)

# 4) Run locally
npm run dev
# → http://localhost:3000
```

Static hosting (optional):

```bash
# Produce a static export you can upload to any simple host
npm run export
# Files appear in ./out
```

If you plan to serve from a subpath (e.g., neelgowdar.com/rush-rad/), you can add a `basePath` to `next.config.mjs`:

```js
const nextConfig = {
  output: 'export',
  basePath: '/rush-rad',
  assetPrefix: '/rush-rad/'
};
export default nextConfig;
```

Then re-run `npm run export` and upload the `out` folder contents to that subdirectory on your host.
