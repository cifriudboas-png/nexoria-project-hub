/*
# Create profiles table with unique usernames for sign-up

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references the Supabase auth user)
  - `username` (text, unique, lowercase letters/numbers/underscore, 3 to 20 characters)
  - `created_at` (timestamp)

2. New Functions
- `handle_new_user()` runs after each new auth user is created and stores the chosen username in `profiles`. It is not callable by app users directly.
- `is_username_available(candidate)` lets the sign-up form check whether a username is free before submitting. It returns only true or false.

3. Security
- Row level security enabled on `profiles`.
- Signed-in users can read only their own profile row.
- No direct insert, update, or delete on `profiles` from the app; rows are created only by the sign-up trigger.
- `is_username_available` is callable by anonymous and signed-in users; it reveals nothing beyond true or false.

4. Important notes
- Usernames are stored in lowercase and must be unique.
- If a username is already taken, the sign-up is rolled back, so no half-created account is left behind.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE CHECK (username ~ '^[a-z0-9_]{3,20}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, lower(NEW.raw_user_meta_data->>'username'));
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.is_username_available(candidate text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = lower(candidate));
$$;

REVOKE EXECUTE ON FUNCTION public.is_username_available(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_username_available(text) TO anon, authenticated;
