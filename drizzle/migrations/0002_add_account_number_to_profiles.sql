/*
# Add sequential account number to profiles

1. Modified Tables
- `profiles`
  - New column `account_number` (bigint, unique, not null): the player's sequential account ID. The first account created is 1, the next is 2, and so on.
  - Existing accounts are numbered in the order they were created.

2. New Objects
- `profiles_account_number_seq`: sequence that hands out the next account number. New sign-ups get the next number automatically through the existing sign-up trigger.

3. Security
- Removes INSERT, UPDATE and DELETE privileges that the app roles held on `profiles`. Rows are created only by the sign-up trigger, and signed-in users can only read their own row, so these privileges were never needed.
- Row level security and the existing read policy are unchanged.

4. Important notes
- The sequence is owned by the migration role, so the sign-up trigger can use it without granting it to app roles.
- The sequence is positioned after the highest existing number, so new accounts never reuse a number.
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS account_number bigint;

UPDATE profiles AS p
SET account_number = numbered.position
FROM (
  SELECT id, row_number() OVER (ORDER BY created_at, id) AS position
  FROM profiles
) AS numbered
WHERE p.id = numbered.id AND p.account_number IS NULL;

CREATE SEQUENCE IF NOT EXISTS profiles_account_number_seq AS bigint;

SELECT setval(
  'profiles_account_number_seq',
  GREATEST(COALESCE((SELECT MAX(account_number) FROM profiles), 0), 1),
  EXISTS (SELECT 1 FROM profiles)
);

ALTER TABLE profiles ALTER COLUMN account_number SET DEFAULT nextval('profiles_account_number_seq');
ALTER TABLE profiles ALTER COLUMN account_number SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_account_number_key ON profiles (account_number);

REVOKE INSERT, UPDATE, DELETE ON profiles FROM anon, authenticated;
