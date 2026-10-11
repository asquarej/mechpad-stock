# MechPad Inventory App

A React + Vite prototype for MechPad inventory and workshop operations.

## Included features

- Multi-location inventory with opening stock batches
- Purchase orders with vendor, invoice, location, item lines, cost, and transport
- Partial deliveries against the same PO and vendor invoice
- Inbound batch log, landed cost, and receipt summaries by invoice
- HQ pricing queue with target-margin pricing rounded up to the next ₦50
- Inventory quantities and stock value derived from batch balances
- FIFO allocation of priced batches to job-card issues
- Role/location access simulation
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

This is a browser-based prototype. It uses localStorage, so data is saved only in the current browser/device. Role restrictions are a UI simulation, not security controls. It does not yet include real authentication, a shared database, multi-user synchronization, or the full specification's transfers, stock counts, field kits, warranty, finance reconciliation, automated reorder plan, and audit immutability.
