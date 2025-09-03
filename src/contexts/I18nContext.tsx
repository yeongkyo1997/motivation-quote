import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Language, Translation } from '../types/i18n';
import { I18nService } from '../services/i18n.service';

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translation;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(
    I18nService.getLanguagePreference()
  );

  const setLanguage = useCallback((newLanguage: Language) => {
    setLanguageState(newLanguage);
    I18nService.saveLanguagePreference(newLanguage);
    document.documentElement.lang = newLanguage;
  }, []);

  const t = I18nService.getTranslation(language);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}