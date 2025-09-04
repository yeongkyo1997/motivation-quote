import { useEffect, useRef, useState } from 'react';
import { SavedQuote } from '../types/saved';
import { useI18n } from '../contexts/I18nContext';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { ConfirmDialog } from './ConfirmDialog';
import { QuoteModal } from './QuoteModal';
import './SavedQuotesDrawer.css';
import './ConfirmDialog.css';

interface SavedQuotesDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  quotes: SavedQuote[];
  favorites: SavedQuote[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function SavedQuotesDrawer({ 
  isOpen, 
  onToggle,
  quotes, 
  favorites,
  onToggleFavorite,
  onDelete,
  onClearAll
}: SavedQuotesDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useI18n();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<SavedQuote | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isCopied && copiedId) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied, copiedId]);

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
    <>
      <button 
        className={`drawer-toggle ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-label="Toggle saved quotes"
      >
        <span className="drawer-toggle-icon">
          {isOpen ? '→' : '←'}
        </span>
        <span className="drawer-toggle-label">
          {t.viewSaved}
        </span>
        {quotes.length > 0 && !isOpen && (
          <span className="drawer-count">{quotes.length}</span>
        )}
      </button>

      <div className={`saved-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onToggle} />
      
      <div className={`saved-drawer ${isOpen ? 'open' : ''}`} ref={drawerRef}>
        <div className="saved-drawer-header">
          <h2>{t.savedQuotes}</h2>
          <button 
            onClick={onToggle} 
            className="saved-drawer-close"
            aria-label="Close saved quotes"
          >
            ✕
          </button>
        </div>

        <div className="saved-drawer-tabs">
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

        <div className="saved-drawer-content">
          {filteredQuotes.length === 0 ? (
            <div className="saved-empty">
              <p>{activeTab === 'favorites' ? t.noFavorites : t.noSavedQuotes}</p>
            </div>
          ) : (
            <div className="saved-quotes-list">
              {filteredQuotes.map(quote => (
                <div key={quote.id} className="saved-quote-item">
                  <div 
                    className="saved-quote-content"
                    onClick={() => setSelectedQuote(quote)}
                    style={{ cursor: 'pointer' }}
                  >
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
          <div className="saved-drawer-footer">
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="clear-all-btn"
            >
              {t.clearAll}
            </button>
          </div>
        )}
      </div>
      
      <ConfirmDialog
        isOpen={showConfirmDialog}
        message={t.confirmDeleteAll}
        confirmText={t.confirm}
        cancelText={t.cancel}
        onConfirm={() => {
          onClearAll();
          setShowConfirmDialog(false);
        }}
        onCancel={() => setShowConfirmDialog(false)}
      />
      
      <QuoteModal
        isOpen={!!selectedQuote}
        quote={selectedQuote}
        onClose={() => setSelectedQuote(null)}
      />
    </>
  );
}