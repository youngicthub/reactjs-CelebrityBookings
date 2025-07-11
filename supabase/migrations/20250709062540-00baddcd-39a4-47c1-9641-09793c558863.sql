-- Clean up any problematic data from the previous migration
DELETE FROM public.profiles WHERE user_id = 'a0000000-0000-0000-0000-000000000001';

-- We should not insert directly into auth.users, let me remove that entry
DELETE FROM auth.users WHERE id = 'a0000000-0000-0000-0000-000000000001';