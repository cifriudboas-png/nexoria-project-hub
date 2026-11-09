import nexoriaLogo from '@/assets/nexoria_logo_transparent.png.asset.json';
import { supabase } from '@/lib/supabase';
import type { TranslationKey } from '@/lib/translations';

export type ShirtId = 'nexoria_logo';
export type HairId = 'cool_blond_hair';

export type ShirtItem = {
  id: ShirtId;
  name: TranslationKey;
  imageUrl: string;
};

export type HairItem = {
  id: HairId;
  name: TranslationKey;
  priceNexos: number;
};

export type EquippedOutfit = {
  shirt: ShirtId | null;
  hair: HairId | null;
};

export const SHIRT_ITEMS: ShirtItem[] = [{ id: 'nexoria_logo', name: 'avatarShirtNexoria', imageUrl: nexoriaLogo.url }];

export const HAIR_ITEMS: HairItem[] = [{ id: 'cool_blond_hair', name: 'avatarHairCoolBlond', priceNexos: 0 }];

export function getShirtItem(id: ShirtId | null): ShirtItem | null {
  return SHIRT_ITEMS.find((item) => item.id === id) ?? null;
}

function isShirtId(value: unknown): value is ShirtId {
  return SHIRT_ITEMS.some((item) => item.id === value);
}

function isHairId(value: unknown): value is HairId {
  return HAIR_ITEMS.some((item) => item.id === value);
}

export async function getEquippedOutfit(): Promise<EquippedOutfit> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = sessionData.session?.user.id;
  if (!userId) return { shirt: null, hair: null };

  const { data, error } = await supabase
    .from('profiles')
    .select('equipped_shirt, equipped_hair')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return {
    shirt: isShirtId(data?.equipped_shirt) ? data.equipped_shirt : null,
    hair: isHairId(data?.equipped_hair) ? data.equipped_hair : null,
  };
}

export async function saveEquippedShirt(shirt: ShirtId | null): Promise<void> {
  const { error } = await supabase.rpc('set_equipped_shirt', { _shirt: shirt ?? '' });
  if (error) throw error;
}

export async function saveEquippedHair(hair: HairId | null): Promise<void> {
  const { error } = await supabase.rpc('set_equipped_hair', { _hair: hair ?? '' });
  if (error) throw error;
}
