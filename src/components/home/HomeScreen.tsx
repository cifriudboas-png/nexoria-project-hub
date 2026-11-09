import { useState } from 'react';
import { Bomb, Box, Pizza, Youtube } from 'lucide-react';
import CharacterViewer from '@/components/avatar/CharacterViewer';
import CatalogView from '@/components/home/CatalogView';
import type { CharacterLook } from '@/components/avatar/characterAppearances';
import ExperienceCard from '@/components/home/ExperienceCard';
import HomeSidebar, { type HomeView } from '@/components/home/HomeSidebar';
import HomeTopBar from '@/components/home/HomeTopBar';
import ProfileView from '@/components/home/ProfileView';
import type { Account } from '@/lib/account';
import { usePreferences } from '@/lib/preferences-context';

type HomeScreenProps = {
  account: Account;
  onSignOut: () => void;
};

const CONTINUE_EXPERIENCES = [
  { title: 'Pizza Tycoon', icon: Pizza, gradientClass: 'bg-gradient-to-br from-amber-300 via-orange-400 to-red-500' },
  { title: 'Bomb Survival', icon: Bomb, gradientClass: 'bg-gradient-to-br from-yellow-300 via-orange-500 to-red-700' },
  { title: 'Video Factory', icon: Youtube, gradientClass: 'bg-gradient-to-br from-sky-300 via-teal-400 to-red-400' },
  { title: 'Ride the Box', icon: Box, gradientClass: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-sky-600' },
];

export default function HomeScreen({ account, onSignOut }: HomeScreenProps) {
  const { t } = usePreferences();
  const { displayName, isGuest } = account;
  const look: CharacterLook = isGuest ? 'guest' : 'starter';
  const [view, setView] = useState<HomeView>('home');

  const openProfile = () => setView('profile');

  return (
    <div className="flex min-h-screen flex-col bg-stone-200 dark:bg-stone-950">
      <HomeTopBar
        displayName={displayName}
        activeView={view}
        onNavigate={setView}
        onSignOut={onSignOut}
        onOpenProfile={openProfile}
      />

      <div className="flex flex-1 flex-col md:flex-row md:items-start">
        <HomeSidebar displayName={displayName} activeView={view} onNavigate={setView} />

        <main className="min-w-0 flex-1 px-4 pb-12 pt-8 sm:px-8 lg:px-12">
          {view === 'catalog' ? (
            <CatalogView />
          ) : view === 'profile' ? (
            <ProfileView displayName={displayName} look={look} isGuest={isGuest} />
          ) : (
            <>
              <section className="flex items-end gap-6">
                <button
                  type="button"
                  onClick={openProfile}
                  aria-label={t('openProfile')}
                  className="relative h-24 w-24 shrink-0 cursor-pointer rounded-full border-4 border-white bg-gradient-to-br from-sky-300 to-sky-500 shadow-lg transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 dark:border-stone-800 sm:h-32 sm:w-32"
                >
                  <CharacterViewer className="h-full w-full rounded-full" framing="bust" look={look} />
                </button>
                <h1 className="pb-2 text-4xl font-black leading-tight tracking-tight text-stone-900 dark:text-stone-100 sm:text-6xl">
                  {t('greetingPrefix')}
                  <button
                    type="button"
                    onClick={openProfile}
                    className="rounded-md transition-colors duration-200 hover:text-sky-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300 dark:hover:text-sky-400"
                  >
                    {displayName}
                  </button>
                  {t('greetingSuffix')}
                </h1>
              </section>

              <section className="mt-10">
                <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">{t('continueSection')}</h2>

                <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {CONTINUE_EXPERIENCES.map((experience) => (
                    <ExperienceCard key={experience.title} {...experience} />
                  ))}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
