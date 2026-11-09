import { useState } from 'react';
import { Check, ChevronRight, Shirt } from 'lucide-react';
import CharacterViewer from '@/components/avatar/CharacterViewer';
import type { CharacterLook } from '@/components/avatar/characterAppearances';
import { SHIRT_ITEMS, type ShirtId } from '@/lib/avatar';
import { usePreferences } from '@/lib/preferences-context';
import type { TranslationKey } from '@/lib/translations';

type EditorTab = 'recent' | 'clothing' | 'body' | 'animations' | 'outfits';

const TABS: { id: EditorTab; label: TranslationKey }[] = [
  { id: 'recent', label: 'avatarTabRecent' },
  { id: 'clothing', label: 'avatarTabClothing' },
  { id: 'body', label: 'avatarTabBody' },
  { id: 'animations', label: 'avatarTabAnimations' },
  { id: 'outfits', label: 'avatarTabOutfits' },
];

const TABS_WITH_SHIRTS: EditorTab[] = ['recent', 'clothing'];

type AvatarEditorViewProps = {
  look: CharacterLook;
  equippedShirt: ShirtId | null;
  isSaving: boolean;
  saveFailed: boolean;
  onEquipShirt: (shirt: ShirtId | null) => void;
  onOpenCatalog: () => void;
};

export default function AvatarEditorView({
  look,
  equippedShirt,
  isSaving,
  saveFailed,
  onEquipShirt,
  onOpenCatalog,
}: AvatarEditorViewProps) {
  const { t } = usePreferences();
  const [tab, setTab] = useState<EditorTab>('recent');
  const items = TABS_WITH_SHIRTS.includes(tab) ? SHIRT_ITEMS : [];
  const tabLabel = TABS.find((entry) => entry.id === tab)?.label ?? 'avatarTabRecent';

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
          {t('avatarTitle')}
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-sm text-stone-600 dark:text-stone-400">{t('avatarExploreCatalog')}</p>
          <button
            type="button"
            onClick={onOpenCatalog}
            className="shrink-0 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-emerald-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300"
          >
            {t('avatarGetMore')}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="lg:w-72 lg:shrink-0">
          <div className="relative h-96 overflow-hidden rounded-xl bg-gradient-to-b from-amber-50 via-stone-200 to-stone-400 shadow-sm ring-1 ring-stone-900/5 dark:from-stone-700 dark:via-stone-800 dark:to-stone-950 dark:ring-white/10">
            <CharacterViewer className="h-full w-full" framing="full" look={look} shirt={equippedShirt} interactive />
            <span className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-xs font-bold text-stone-800 shadow dark:bg-stone-900/90 dark:text-stone-100">
              3D
            </span>
            <p className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-xs font-medium text-stone-700/80 dark:text-stone-400">
              {t('dragToRotate')}
            </p>
          </div>
          <p className="mt-2 h-5 text-xs text-stone-500 dark:text-stone-400" role="status">
            {isSaving ? t('avatarSaving') : saveFailed ? <span className="text-red-700 dark:text-red-400">{t('avatarSaveError')}</span> : null}
          </p>
        </div>

        <section className="min-w-0 flex-1">
          <div className="flex overflow-x-auto rounded-t-lg bg-white shadow-sm ring-1 ring-stone-900/5 dark:bg-stone-900 dark:ring-white/10" role="tablist">
            {TABS.map((entry) => {
              const isActive = entry.id === tab;
              return (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setTab(entry.id)}
                  className={`flex-1 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'border-sky-600 text-stone-900 dark:text-stone-100'
                      : 'border-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                  }`}
                >
                  {t(entry.label)}
                </button>
              );
            })}
          </div>

          <p className="mt-3 flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400">
            {t(tabLabel)}
            <ChevronRight className="h-3 w-3" />
            {t('avatarAll')}
          </p>

          {items.length > 0 ? (
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {items.map((item) => {
                const isEquipped = item.id === equippedShirt;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isEquipped}
                    onClick={() => onEquipShirt(isEquipped ? null : item.id)}
                    className={`group relative overflow-hidden rounded-lg bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 dark:bg-stone-900 ${
                      isEquipped ? 'ring-2 ring-emerald-500' : 'ring-1 ring-stone-900/5 dark:ring-white/10'
                    }`}
                  >
                    {isEquipped && (
                      <span className="absolute right-0 top-0 z-10 flex h-8 w-8 items-start justify-end bg-emerald-500 p-1 text-white [clip-path:polygon(0_0,100%_0,100%_100%)]">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="flex aspect-square items-center justify-center bg-stone-50 p-3 dark:bg-stone-800">
                      <div className="relative flex h-full w-full items-center justify-center">
                        <Shirt className="absolute h-full w-full text-white drop-shadow dark:text-stone-200" strokeWidth={1} fill="currentColor" />
                        <img
                          src={item.imageUrl}
                          alt=""
                          draggable={false}
                          className="relative w-1/3 object-contain transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </div>
                    <p className="line-clamp-2 px-2 py-2 text-xs font-medium text-stone-800 dark:text-stone-100">{t(item.name)}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 flex min-h-[16rem] flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 bg-white/60 px-6 py-10 text-center dark:border-stone-700 dark:bg-stone-900/60">
              <p className="text-base font-semibold text-stone-700 dark:text-stone-200">{t('avatarEmptyTitle')}</p>
              <p className="mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">{t('avatarEmptyText')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
