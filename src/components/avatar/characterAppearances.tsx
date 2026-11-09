import type { ReactNode } from 'react';

export type CharacterLook = 'starter' | 'guest';

export type CharacterAppearance = {
  skin: string;
  shirt: string;
  sleeve: string;
  pants: string;
  torsoFront: ReactNode;
};

export const CHARACTER_APPEARANCES: Record<CharacterLook, CharacterAppearance> = {
  starter: {
    skin: '#F5BE1E',
    shirt: '#2E9E4A',
    sleeve: '#F5BE1E',
    pants: '#8D9299',
    torsoFront: null,
  },
  guest: {
    skin: '#F4EFE9',
    shirt: '#3A3D42',
    sleeve: '#3A3D42',
    pants: '#141414',
    torsoFront: (
      <img
        src="/file_00000000777c820e98955176e9639e6e.png"
        alt=""
        draggable={false}
        className="h-7 w-7 object-contain"
      />
    ),
  },
};
