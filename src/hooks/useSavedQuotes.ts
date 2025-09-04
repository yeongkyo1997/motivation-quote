import { useState, useCallback, useEffect } from 'react';
import { savedQuotesService } from '../services/savedQuotes.service';
import { SavedQuote, SavedQuotesState, SavedQuotesActions } from '../types/saved';

export const useSavedQuotes = (): SavedQuotesState & SavedQuotesActions => {
  const [quotes, setQuotes] = useState<SavedQuote[]>([]);
  const [favorites, setFavorites] = useState<SavedQuote[]>([]);

  const loadQuotes = useCallback(() => {
    const allQuotes = savedQuotesService.getAll();
    setQuotes(allQuotes);
    setFavorites(allQuotes.filter(q => q.isFavorite));
  }, []);

  useEffect(() => {
    loadQuotes();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'wisdom_whispers_saved_quotes') {
        loadQuotes();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadQuotes]);

  const saveQuote = useCallback((quote: string, author: string | null, language: 'ko' | 'en', isFavorite: boolean = false) => {
    savedQuotesService.save(quote, author, language, isFavorite);
    loadQuotes();
  }, [loadQuotes]);

  const toggleFavorite = useCallback((id: string) => {
    savedQuotesService.toggleFavorite(id);
    loadQuotes();
  }, [loadQuotes]);

  const deleteQuote = useCallback((id: string) => {
    savedQuotesService.delete(id);
    loadQuotes();
  }, [loadQuotes]);

  const clearAll = useCallback(() => {
    savedQuotesService.clearAll();
    loadQuotes();
  }, [loadQuotes]);

  const isQuoteSaved = useCallback((quote: string): boolean => {
    return savedQuotesService.exists(quote);
  }, []);

  const isQuoteFavorited = useCallback((quote: string): boolean => {
    return savedQuotesService.isFavorited(quote);
  }, []);

  return {
    quotes,
    favorites,
    saveQuote,
    toggleFavorite,
    deleteQuote,
    clearAll,
    isQuoteSaved,
    isQuoteFavorited
  };
};