import nexoriaLogo from '@/assets/nexoria_logo_transparent.png.asset.json';
import { supabase } from '@/lib/supabase';
import type { TranslationKey } from '@/lib/translations';

export type ShirtId = 'nexoria_logo';

export type ShirtItem = {
  id: ShirtId;
  name: TranslationKey;
  imageUrl: string;
};

export const SHIRT_ITEMS: ShirtItem[] = [{ id: 'nexoria_logo', name: 'avatarShirtNexoria', imageUrl: nexoriaLogo.url }];

export function getShirtItem(id: ShirtId | null): ShirtItem | null {
  return SHIRT_ITEMS.find((item) => item.id === id) ?? null;
}

function isShirtId(value: unknown): value is ShirtId {
  return SHIRT_ITEMS.some((item) => item.id === value);
}

export async function getEquippedShirt(): Promise<ShirtId | null> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const userId = sessionData.session?.user.id;
  if (!userId) return null;

  const { data, error } = await supabase.from('profiles').select('equipped_shirt').eq('id', userId).maybeSingle();
  if (error) throw error;
  return isShirtId(data?.equipped_shirt) ? data.equipped_shirt : null;
}

export async function saveEquippedShirt(shirt: ShirtId | null): Promise<void> {
  const { error } = await supabase.rpc('set_equipped_shirt', { _shirt: shirt ?? '' });
  if (error) throw error;
}
