ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS equipped_hair text
  CHECK (equipped_hair IS NULL OR equipped_hair IN ('cool_blond_hair'));

CREATE OR REPLACE FUNCTION public.set_equipped_hair(_hair text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE public.profiles SET equipped_hair = NULLIF(_hair, '') WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.set_equipped_hair(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_equipped_hair(text) TO authenticated;