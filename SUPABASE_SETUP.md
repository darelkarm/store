# Karam Publishing — Supabase + Admin Setup

This app uses your own Supabase project as the backend and a hidden admin panel at `/karam-admin` for managing the books catalog. Everything runs in the browser via the Supabase JS SDK, so the frontend can be deployed as a static site (GitHub Pages, Netlify, Cloudflare Pages, etc.).

---

## 1. One-time Supabase setup

In **[Supabase Dashboard](https://supabase.com/dashboard)** → your project:

### 1.1 Create the schema
Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](./supabase/schema.sql), and **Run**.

### 1.2 Import all existing books
In the same SQL Editor, paste the contents of [`supabase/seed.sql`](./supabase/seed.sql) and **Run**. This inserts the 63 books currently on the site.

### 1.3 Create the admin user
Go to **Authentication → Users → Add user → "Create new user"**:

- Email: `y2005azab@gmail.com`
- Password: `Admin@123456`
- ✅ **Auto Confirm User**

### 1.4 Grant admin role
Back in **SQL Editor**, paste [`supabase/promote_admin.sql`](./supabase/promote_admin.sql) and **Run**. You should see a row showing the email + `admin` role.

---

## 2. Logging in

The admin panel lives at:

```
https://your-site.com/karam-admin
```

There are no buttons linking to it — only people with the URL can find it. Enter the email + password from step 1.3.

From the dashboard you can **add / edit / delete** books. Changes appear instantly on the public site (frontend re-fetches from Supabase).

---

## 3. Managing admins

### Change the admin password
1. Log into the admin panel, click your user in **Supabase → Authentication → Users**.
2. Click **"Send password recovery"** OR use **"Reset password"** to set a new one.

### Add another admin
1. **Authentication → Users → Add user**: enter their email + a starting password, ✅ Auto Confirm.
2. **SQL Editor**:
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   SELECT id, 'admin'::public.app_role
   FROM auth.users
   WHERE email = 'NEW_ADMIN@example.com'
   ON CONFLICT (user_id, role) DO NOTHING;
   ```

### Remove an admin
```sql
DELETE FROM public.user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'OLD_ADMIN@example.com');
```

---

## 4. Security model

- **Anonymous users**: read-only access to `books` and `categories` only (enforced by RLS policies).
- **Authenticated users**: same as anonymous, **unless** they appear in `user_roles` with role `admin`.
- **Admins**: full CRUD on `books` and `categories`.
- The anon key in `src/lib/supabase.ts` is **safe to publish** — it's a public identifier; all permissions are enforced server-side by Postgres RLS.

---

## 5. Deployment

The frontend talks to Supabase directly from the browser, so it works on any static host.

- **GitHub Pages** — push to `main`, the workflow at `.github/workflows/static.yml` builds and deploys automatically. Make sure GitHub Pages is set to **GitHub Actions** in your repo's Settings → Pages.
- **Cloudflare Pages / Netlify / Vercel** — point the build command to `bun run build` and publish the `dist/client` directory.

No environment variables or secrets need to be configured at the host — the Supabase URL and anon key are embedded in the build.

---

## 6. Files added / changed

| File | Purpose |
|---|---|
| `supabase/schema.sql` | Tables, RLS policies, `is_admin()` helper |
| `supabase/seed.sql` | Import of all current books |
| `supabase/promote_admin.sql` | Grant admin role to a user |
| `src/lib/supabase.ts` | Supabase client + DB types |
| `src/hooks/use-books.ts` | Reads books/categories from Supabase (with offline fallback) |
| `src/routes/karam-admin.index.tsx` | Hidden login page |
| `src/routes/karam-admin.dashboard.tsx` | Admin CRUD dashboard |
| `.github/workflows/static.yml` | GitHub Pages build + deploy |
