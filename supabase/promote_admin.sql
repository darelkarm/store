-- ============================================================
-- Promote a user to admin. Run AFTER you've created the user
-- in Supabase Dashboard → Authentication → Add user.
--
-- Steps:
-- 1. Auth → Users → Add user → "Create new user"
--      Email:    y2005azab@gmail.com
--      Password: Admin@123456
--      ✅ Auto Confirm User
-- 2. Run the SQL below.
-- 3. To add ANOTHER admin later, repeat with a different email.
-- ============================================================

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'y2005azab@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify
SELECT u.email, r.role
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id;
