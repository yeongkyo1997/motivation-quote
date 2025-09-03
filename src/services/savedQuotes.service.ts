import { SavedQuote } from '../types/saved';

interface ISavedQuotesService {
  getAll(): SavedQuote[];
  save(quote: string, author: string | null, language: 'ko' | 'en'): SavedQuote;
  toggleFavorite(id: string): void;
  delete(id: string): void;
  clearAll(): void;
  exists(quote: string): boolean;
  isFavorited(quote: string): boolean;
}

class SavedQuotesService implements ISavedQuotesService {
  private readonly STORAGE_KEY = 'wisdom_whispers_saved_quotes';
  private readonly MAX_QUOTES = 100;

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getStoredQuotes(): SavedQuote[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.filter(q => 
        q && typeof q === 'object' && 
        'id' in q && 'quote' in q && 'savedAt' in q
      );
    } catch {
      return [];
    }
  }

  private saveToStorage(quotes: SavedQuote[]): void {
    try {
      const limitedQuotes = quotes.slice(0, this.MAX_QUOTES);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedQuotes));
    } catch (error) {
      console.error('Failed to save quotes:', error);
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        const reduced = quotes.slice(0, Math.floor(this.MAX_QUOTES / 2));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reduced));
      }
    }
  }

  getAll(): SavedQuote[] {
    return this.getStoredQuotes();
  }

  save(quote: string, author: string | null, language: 'ko' | 'en', isFavorite: boolean = false): SavedQuote {
    const quotes = this.getStoredQuotes();
    
    const existingIndex = quotes.findIndex(q => q.quote === quote);
    if (existingIndex !== -1) {
      return quotes[existingIndex];
    }

    const newQuote: SavedQuote = {
      id: this.generateId(),
      quote,
      author,
      savedAt: Date.now(),
      isFavorite,
      language
    };

    quotes.unshift(newQuote);
    this.saveToStorage(quotes);
    
    return newQuote;
  }

  toggleFavorite(id: string): void {
    const quotes = this.getStoredQuotes();
    const index = quotes.findIndex(q => q.id === id);
    
    if (index !== -1) {
      quotes[index].isFavorite = !quotes[index].isFavorite;
      this.saveToStorage(quotes);
    }
  }

  delete(id: string): void {
    const quotes = this.getStoredQuotes();
    const filtered = quotes.filter(q => q.id !== id);
    this.saveToStorage(filtered);
  }

  clearAll(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exists(quote: string): boolean {
    const quotes = this.getStoredQuotes();
    return quotes.some(q => q.quote === quote);
  }

  isFavorited(quote: string): boolean {
    const quotes = this.getStoredQuotes();
    const found = quotes.find(q => q.quote === quote);
    return found?.isFavorite ?? false;
  }
}

export const savedQuotesService = new SavedQuotesService();