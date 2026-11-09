import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { PreferencesContext, type Theme } from '@/lib/preferences-context';
import { translate, type Language, type TranslationKey } from '@/lib/translations';

const THEME_STORAGE_KEY = 'nexoria-theme';
const LANGUAGE_STORAGE_KEY = 'nexoria-language';

function readStoredTheme(): Theme {
  return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
}

function readStoredLanguage(): Language {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'en' ? 'en' : 'pt';
}

type PreferencesProviderProps = {
  children: ReactNode;
};

export default function PreferencesProvider({ children }: PreferencesProviderProps) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);
  const [language, setLanguage] = useState<Language>(readStoredLanguage);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
      t: (key: TranslationKey, params?: Record<string, string | number>) =>
        translate(language, key, params),
    }),
    [theme, language],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
