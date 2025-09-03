export interface SavedQuote {
  id: string;
  quote: string;
  author: string | null;
  savedAt: number;
  isFavorite: boolean;
  language: 'ko' | 'en';
}

export interface SavedQuotesState {
  quotes: SavedQuote[];
  favorites: SavedQuote[];
}

export interface SavedQuotesActions {
  saveQuote: (quote: string, author: string | null, language: 'ko' | 'en', isFavorite?: boolean) => void;
  toggleFavorite: (id: string) => void;
  deleteQuote: (id: string) => void;
  clearAll: () => void;
  isQuoteSaved: (quote: string) => boolean;
  isQuoteFavorited: (quote: string) => boolean;
}