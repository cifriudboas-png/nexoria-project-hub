import { describe, expect, it } from 'vitest';
import { HAIR_ITEMS } from '@/lib/avatar';

describe('catalog hair items', () => {
  it('"Cabelo maneiro loiro" costs 0 Nexos', () => {
    const hair = HAIR_ITEMS.find((item) => item.id === 'cool_blond_hair');
    expect(hair?.priceNexos).toBe(0);
  });
});
