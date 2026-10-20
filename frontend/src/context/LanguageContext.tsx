import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'vehx_language_v1';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'en' || saved === 'es' ? saved : 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const dict = translations[language] || translations.es;
    let text: string = (dict as Record<string, string>)[key] || (translations.es as Record<string, string>)[key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue));
      });
    }

    return text;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser utilizado dentro de un LanguageProvider');
  }
  return context;
};

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center bg-river border border-tea/50 rounded-xl p-0.5 text-xs font-bold ${className}`}>
      <button
        onClick={() => setLanguage('es')}
        className={`px-2 py-0.5 rounded-lg transition-all ${
          language === 'es'
            ? 'bg-amber-autumn text-river shadow-sm font-extrabold'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Cambiar idioma a Español"
        aria-label="Español"
      >
        ES
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-0.5 rounded-lg transition-all ${
          language === 'en'
            ? 'bg-amber-autumn text-river shadow-sm font-extrabold'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        title="Switch language to English"
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
};
