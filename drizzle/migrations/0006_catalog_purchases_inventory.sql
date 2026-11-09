ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS nexos bigint NOT NULL DEFAULT 0 CHECK (nexos >= 0);

CREATE TABLE public.inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_id text NOT NULL,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_id)
);

GRANT SELECT ON public.inventory_items TO authenticated;
GRANT ALL ON public.inventory_items TO service_role;

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_own_inventory ON public.inventory_items
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Players who already wear the hair keep it.
INSERT INTO public.inventory_items (user_id, item_id)
SELECT id, equipped_hair FROM public.profiles WHERE equipped_hair IS NOT NULL
ON CONFLICT (user_id, item_id) DO NOTHING;

-- Prices of items sold in the catalog. NULL = not for sale.
CREATE OR REPLACE FUNCTION public.catalog_price(_item text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT CASE _item
    WHEN 'cool_blond_hair' THEN 0
    ELSE NULL
  END
$$;

CREATE OR REPLACE FUNCTION public.purchase_item(_item text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _price integer;
  _balance bigint;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  _price := public.catalog_price(_item);
  IF _price IS NULL THEN
    RAISE EXCEPTION 'unknown_item';
  END IF;

  SELECT nexos INTO _balance FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF _balance IS NULL THEN
    RAISE EXCEPTION 'profile_not_found';
  END IF;

  IF EXISTS (SELECT 1 FROM public.inventory_items WHERE user_id = auth.uid() AND item_id = _item) THEN
    RAISE EXCEPTION 'already_owned';
  END IF;

  IF _balance < _price THEN
    RAISE EXCEPTION 'insufficient_nexos';
  END IF;

  UPDATE public.profiles SET nexos = nexos - _price WHERE id = auth.uid();
  INSERT INTO public.inventory_items (user_id, item_id) VALUES (auth.uid(), _item);
END;
$$;

REVOKE ALL ON FUNCTION public.purchase_item(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.purchase_item(text) TO authenticated;

-- Players can only wear hair they own.
CREATE OR REPLACE FUNCTION public.set_equipped_hair(_hair text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF NULLIF(_hair, '') IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.inventory_items WHERE user_id = auth.uid() AND item_id = _hair
  ) THEN
    RAISE EXCEPTION 'not_owned';
  END IF;
  UPDATE public.profiles SET equipped_hair = NULLIF(_hair, '') WHERE id = auth.uid();
END;
$$;

REVOKE ALL ON FUNCTION public.set_equipped_hair(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_equipped_hair(text) TO authenticated;