-- Create a default admin user
-- First, insert the user into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_sent_at,
  recovery_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'admin@celebritybooking.com',
  crypt('Admin123!', gen_salt('bf')),
  now(),
  now(),
  now(),
  'authenticated',
  'authenticated',
  '',
  '',
  '',
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"System Administrator"}',
  false,
  now(),
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
) ON CONFLICT (id) DO NOTHING;

-- Create the corresponding profile with admin role
INSERT INTO public.profiles (
  id,
  user_id,
  email,
  full_name,
  role,
  created_at,
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'admin@celebritybooking.com',
  'System Administrator',
  'admin',
  now(),
  now()
) ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  email = 'admin@celebritybooking.com',
  full_name = 'System Administrator';