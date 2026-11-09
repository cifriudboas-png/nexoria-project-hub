ALTER TABLE public.profiles
  ADD COLUMN equipped_shirt text
  CONSTRAINT profiles_equipped_shirt_check CHECK (equipped_shirt IS NULL OR equipped_shirt IN ('nexoria_logo'));

CREATE OR REPLACE FUNCTION public.set_equipped_shirt(_shirt text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  UPDATE public.profiles SET equipped_shirt = _shirt WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.set_equipped_shirt(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_equipped_shirt(text) TO authenticated;