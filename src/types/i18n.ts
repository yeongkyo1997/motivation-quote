export type Language = 'ko' | 'en';

export interface Translation {
  appTitle: string;
  appSubtitle: string;
  getNewQuote: string;
  copy: string;
  copied: string;
  share: string;
  tweet: string;
  shareThisWisdom: string;
  loading: string;
  error: string;
  retry: string;
  errorMessage: string;
  retryExhausted: string;
  footer: string;
  new: string;
  email: string;
  close: string;
  savedQuotes: string;
  allQuotes: string;
  favorites: string;
  noSavedQuotes: string;
  noFavorites: string;
  clearAll: string;
  save: string;
  saved: string;
  viewSaved: string;
  today: string;
  yesterday: string;
  daysAgo: string;
  weeksAgo: string;
  monthsAgo: string;
  yearsAgo: string;
}

export interface I18nConfig {
  language: Language;
  translations: Record<Language, Translation>;
}