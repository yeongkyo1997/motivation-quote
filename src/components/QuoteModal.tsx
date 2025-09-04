import { memo } from 'react';
import { SavedQuote } from '../types/saved';
import { useI18n } from '../contexts/I18nContext';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import './QuoteModal.css';

interface QuoteModalProps {
  isOpen: boolean;
  quote: SavedQuote | null;
  onClose: () => void;
}

export const QuoteModal = memo<QuoteModalProps>(({ isOpen, quote, onClose }) => {
  const { t } = useI18n();
  const { copyToClipboard } = useCopyToClipboard();

  if (!isOpen || !quote) return null;

  const handleCopy = () => {
    const fullQuote = `${quote.quote}${quote.author ? ` - ${quote.author}` : ''}`;
    copyToClipboard(fullQuote);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="quote-modal-overlay" onClick={handleOverlayClick}>
        <div className="quote-modal">
          <button 
            className="quote-modal-close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M15 5L5 15M5 5L15 15" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          <div className="quote-modal-content">
            <blockquote className="quote-modal-text">
              {quote.quote}
            </blockquote>
            
            {quote.author && (
              <div className="quote-modal-author">
                — {quote.author}
              </div>
            )}
            
            <div className="quote-modal-actions">
              <button 
                className="quote-modal-action-btn"
                onClick={handleCopy}
                title={t.copy}
              >
                📋 {t.copy}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});