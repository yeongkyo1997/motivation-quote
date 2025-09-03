import { memo, useState } from 'react';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useI18n } from '../contexts/I18nContext';

interface QuoteCardProps {
  quote: string;
  className?: string;
}

export const QuoteCard = memo<QuoteCardProps>(({ quote, className = '' }) => {
  const parts = quote.split(' - ');
  const quoteText = parts[0] || quote;
  const author = parts[1] || '';
  const { copyToClipboard } = useCopyToClipboard();
  const { t } = useI18n();
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  
  const handleCopyClick = () => {
    copyToClipboard(quote);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };
  
  return (
    <article 
      className={`quote-card ${className} ${showCopyFeedback ? 'copied' : ''}`}
      aria-label="Motivation quote"
    >
      <blockquote className="quote-content">
        <p 
          className="quote-text clickable-text"
          onClick={handleCopyClick}
          title={t.copy}
        >
          {quoteText}
        </p>
        {author && <footer className="quote-author">— {author}</footer>}
      </blockquote>
      {showCopyFeedback && (
        <div className="copy-feedback">
          {t.copied}
        </div>
      )}
    </article>
  );
});