# MechPad Inventory App

A React + Vite prototype for MechPad inventory and workshop operations.

## Included features

- Location-based inventory
- Role/location access simulation
- Single stock upload
- CSV bulk upload
- Supplier receipts
- Multi-line job cards
- Job types:
  - Maintenance
  - Repair
  - Refurbishment
  - Warranty
  - Maintenance & Repair
- Per-line payment classification:
  - Captain-paid
  - Company complimentary
- Dashboard and reports
- Browser local-storage persistence

## Run locally

Install Node.js, then open a terminal in this folder:

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Build for deployment

```bash
npm run build
```

The production files will be generated in the `dist` folder.

## Deploy with Netlify

1. Create an account at https://www.netlify.com/
2. Choose **Add new site** and then **Deploy manually**.
3. Run `npm install` and `npm run build` locally.
4. Drag the generated `dist` folder into Netlify.

## Deploy with Vercel

1. Create an account at https://vercel.com/
2. Upload this project to GitHub.
3. Import the GitHub repository into Vercel.
4. Vercel will detect Vite automatically.

## Important limitation

This is a browser-based prototype. It uses localStorage, so data is saved only in the current browser/device. It does not yet include real authentication, a shared database, or multi-user synchronization.
