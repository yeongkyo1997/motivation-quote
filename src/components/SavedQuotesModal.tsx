import { useEffect, useRef, useState } from 'react';
import { SavedQuote } from '../types/saved';
import { useI18n } from '../contexts/I18nContext';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import './SavedQuotesModal.css';

interface SavedQuotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  quotes: SavedQuote[];
  favorites: SavedQuote[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function SavedQuotesModal({ 
  isOpen, 
  onClose, 
  quotes, 
  favorites,
  onToggleFavorite,
  onDelete,
  onClearAll
}: SavedQuotesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isCopied && copiedId) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, copiedId]);

  if (!isOpen) return null;

  const displayQuotes = activeTab === 'favorites' ? favorites : quotes;
  const filteredQuotes = displayQuotes.filter(q => q.language === language);

  const handleCopy = (quote: SavedQuote) => {
    const text = quote.author ? `"${quote.quote}" - ${quote.author}` : quote.quote;
    copyToClipboard(text);
    setCopiedId(quote.id);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return t.today;
    if (days === 1) return t.yesterday;
    if (days < 7) return `${days}${t.daysAgo}`;
    if (days < 30) return `${Math.floor(days / 7)}${t.weeksAgo}`;
    if (days < 365) return `${Math.floor(days / 30)}${t.monthsAgo}`;
    return `${Math.floor(days / 365)}${t.yearsAgo}`;
  };

  return (
    <div className="saved-modal-overlay" aria-modal="true" role="dialog">
      <div className="saved-modal" ref={modalRef}>
        <div className="saved-modal-header">
          <h2>{t.savedQuotes}</h2>
          <button 
            onClick={onClose} 
            className="saved-modal-close"
            aria-label="Close saved quotes"
          >
            ✕
          </button>
        </div>

        <div className="saved-modal-tabs">
          <button
            className={`saved-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {t.allQuotes} ({quotes.filter(q => q.language === language).length})
          </button>
          <button
            className={`saved-tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            {t.favorites} ({favorites.filter(q => q.language === language).length})
          </button>
        </div>

        <div className="saved-modal-content">
          {filteredQuotes.length === 0 ? (
            <div className="saved-empty">
              <p>{activeTab === 'favorites' ? t.noFavorites : t.noSavedQuotes}</p>
            </div>
          ) : (
            <div className="saved-quotes-list">
              {filteredQuotes.map(quote => (
                <div key={quote.id} className="saved-quote-item">
                  <div className="saved-quote-content">
                    <p className="saved-quote-text">"{quote.quote}"</p>
                    {quote.author && (
                      <p className="saved-quote-author">— {quote.author}</p>
                    )}
                    <p className="saved-quote-date">{formatDate(quote.savedAt)}</p>
                  </div>
                  <div className="saved-quote-actions">
                    <button
                      onClick={() => onToggleFavorite(quote.id)}
                      className={`saved-action-btn favorite-btn ${quote.isFavorite ? 'active' : ''}`}
                      aria-label={quote.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {quote.isFavorite ? '★' : '☆'}
                    </button>
                    <button
                      onClick={() => handleCopy(quote)}
                      className={`saved-action-btn copy-btn ${copiedId === quote.id ? 'copied' : ''}`}
                      aria-label="Copy quote"
                    >
                      {copiedId === quote.id ? '✓' : '📋'}
                    </button>
                    <button
                      onClick={() => onDelete(quote.id)}
                      className="saved-action-btn delete-btn"
                      aria-label="Delete quote"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {quotes.length > 0 && (
          <div className="saved-modal-footer">
            <button
              onClick={onClearAll}
              className="clear-all-btn"
            >
              {t.clearAll}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}