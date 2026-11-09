/*
# Remove username availability lookup

1. Modified Functions
- Drops `is_username_available(text)`, a helper that let the sign-up form check a username before submitting.

2. Why
- Usernames map to unique internal sign-in addresses, so the sign-up itself already rejects a name that is taken.
- Removing the helper means no database function is callable by people who are not signed in, except the sign-up trigger, which is not callable by app users at all.

3. Data safety
- No tables, rows, or user accounts are changed.
*/

DROP FUNCTION IF EXISTS public.is_username_available(text);
