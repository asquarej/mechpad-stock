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
- Profile-based role and location access
- Central Part Master with permanent serials, four-character part codes, and vehicle-specific 13-character part numbers
- Multi-model part compatibility and optional supplier SKU suffixes
- Purchase-order selection from the part catalogue without creating stock until receipt
- Imported catalogue: 324 master parts and 577 vehicle-specific/SKU rows from the MechPad Part Number Generator workbook
- Multi-line job cards
- Supabase email/password login with profile-assigned roles and locations
- Location-scoped shared workspaces; HQ managers can switch between all eight locations
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

## Configure secure location workspaces

The app requires Supabase to enable logins and shared workspaces:

1. Create a Supabase project and run `supabase/migrations/20261011140000_location_workspaces_auth.sql` in its SQL Editor.
2. In Supabase Authentication, create one user for each location and any HQ users. Public self-registration is not used. Use unique temporary passwords and share/store them only in an approved password manager; never commit passwords to this repository.
3. For the approved test setup, create these nine Auth users: `adeoyeakanmu@gmail.com` (HQ Business Head) and `adeoyeakanmu+ibadan@gmail.com`, `+ilupeju@gmail.com`, `+kano@gmail.com`, `+abuja@gmail.com`, `+akure@gmail.com`, `+ilorin@gmail.com`, `+asaba@gmail.com`, `+ondo@gmail.com` (each location's Inventory Officer). Then run `supabase/seed_test_profiles.sql` in the SQL Editor to create the role/location profiles.
4. Alternatively, add one `public.profiles` row for every Auth user. The profile role must be one of `business_head`, `manager`, `finance`, `inventory_officer`, `workshop_officer`, or `technical_ops_lead`. City roles must have their exact location; HQ roles must have a null location. Profiles can be assigned in the Supabase SQL Editor, for example:

   ```sql
   insert into public.profiles (id, display_name, role, location)
   select id, 'Ibadan Inventory Officer', 'inventory_officer', 'Ibadan'
   from auth.users
   where email = 'inventory-ibadan@example.com';
   ```

5. In Vercel project settings, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project API settings, then redeploy. These public client values are not secrets; never expose a Supabase service-role key in the browser or repository.
6. Sign in with each provisioned account. Location officers are restricted to their assigned workspace by database row-level security; Business Head and Manager accounts can select any city from **Location workspace**.

The SQL migration creates all eight locations and enables row-level security. Authentication users and profiles are provisioned by the project administrator; do not share passwords in source control or chat.

## Important limitation

When Supabase is configured, workspace data is shared through Supabase and row-level security limits each location account to its own workspace while HQ roles can reach all locations. Without Supabase configuration, a local demo is available in development only; production deployments fail closed and display setup instructions. The current workspace payload is JSON per location: location access is enforced in the database, but field-by-field permissions and immutable transaction/audit records are not yet enforced server-side. The full specification's transfers, stock counts, field kits, warranty, finance reconciliation, automated reorder plan, and server-transactional ledger remain future work.
