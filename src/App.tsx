import { useState, useEffect } from 'react';
import { useQuote } from './hooks/useQuote';
import { useShare } from './hooks/useShare';
import { useSavedQuotes } from './hooks/useSavedQuotes';
import { QuoteCard } from './components/QuoteCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { ThemeToggle } from './components/ThemeToggle';
import { ShareModal } from './components/ShareModal';
import { SavedQuotesDrawer } from './components/SavedQuotesDrawer';
import { FavoriteButton } from './components/FavoriteButton';
import { LanguageSelector } from './components/LanguageSelector';
import { useI18n } from './contexts/I18nContext';
import { parseQuote } from './utils/parseQuote';
import './App.css';

function App() {
  const { language, t } = useI18n();
  const { quote, loading, error, fetchNewQuote, retryCount } = useQuote(language);
  const { share, canShare } = useShare();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const {
    quotes: savedQuotes,
    favorites,
    saveQuote,
    toggleFavorite,
    deleteQuote,
    clearAll,
    isQuoteSaved,
    isQuoteFavorited
  } = useSavedQuotes();

  const parsedQuote = quote ? parseQuote(quote) : null;
  const currentQuoteId = savedQuotes.find(q => q.quote === parsedQuote?.text)?.id;

  useEffect(() => {
    if (parsedQuote) {
      setIsSaved(isQuoteSaved(parsedQuote.text));
      setIsFavorited(isQuoteFavorited(parsedQuote.text));
    }
  }, [parsedQuote, isQuoteSaved, isQuoteFavorited, savedQuotes, favorites]);

  return (
    <main className="app">
      <ThemeToggle />
      <LanguageSelector />
      <header className="app-header">
        <h1 className="app-title">{t.appTitle}</h1>
        <p className="app-subtitle">{t.appSubtitle}</p>
      </header>

      <section className="content-container">
        {loading && (
          <LoadingSpinner size="large" />
        )}

        {error && !loading && (
          <ErrorMessage 
            error={error} 
            onRetry={fetchNewQuote}
            retryCount={retryCount}
          />
        )}

        {quote && !loading && !error && parsedQuote && (
          <>
            <div className="quote-with-favorite">
              <QuoteCard quote={quote} />
              <div className="favorite-button-wrapper">
                <FavoriteButton
                  isFavorite={isFavorited}
                  onClick={() => {
                    if (!isSaved) {
                      saveQuote(parsedQuote.text, parsedQuote.author, language, true);
                      setIsSaved(true);
                      setIsFavorited(true);
                    } else if (currentQuoteId) {
                      toggleFavorite(currentQuoteId);
                      setIsFavorited(!isFavorited);
                    }
                  }}
                  size="large"
                />
              </div>
            </div>
            <div className="button-container">
              <button
                onClick={fetchNewQuote}
                className="refresh-button"
                disabled={loading}
                aria-label="Get new quote"
              >
                <span className="dice-icon">🎲</span>
                {t.getNewQuote}
              </button>
              <button
                onClick={async () => {
                  if (canShare) {
                    await share({
                      title: 'Wisdom Whispers',
                      text: quote,
                      url: window.location.href
                    });
                  } else {
                    setIsShareModalOpen(true);
                  }
                }}
                className="share-button"
                aria-label="Share quote"
              >
                <span className="share-icon">📤</span>
                {t.share}
              </button>
            </div>
          </>
        )}
      </section>

      <footer className="app-footer">
        <p>{t.footer}</p>
      </footer>
      
      {quote && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          text={quote}
          url={window.location.href}
        />
      )}
      
      <SavedQuotesDrawer
        isOpen={isDrawerOpen}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        quotes={savedQuotes}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onDelete={deleteQuote}
        onClearAll={clearAll}
      />
    </main>
  );
}

export default App
