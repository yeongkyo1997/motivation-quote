import { memo } from 'react';
import { ApiError } from '../types/index';
import { useI18n } from '../contexts/I18nContext';

interface ErrorMessageProps {
  error: ApiError;
  onRetry?: () => void;
  retryCount?: number;
  maxRetries?: number;
}

export const ErrorMessage = memo<ErrorMessageProps>(({ 
  error, 
  onRetry,
  retryCount = 0,
  maxRetries = 3
}) => {
  const { t } = useI18n();
  const canRetry = retryCount < maxRetries;

  return (
    <div className="error-message" role="alert">
      <div className="error-content">
        <h3 className="error-title">{t.error}</h3>
        <p className="error-text">{error.message || t.errorMessage}</p>
        {error.code && (
          <p className="error-code">Error code: {error.code}</p>
        )}
      </div>
      {onRetry && canRetry && (
        <button
          onClick={onRetry}
          className="retry-button"
          aria-label="Try again"
        >
          {t.retry} ({maxRetries - retryCount})
        </button>
      )}
      {onRetry && !canRetry && (
        <p className="retry-exhausted">{t.retryExhausted}</p>
      )}
    </div>
  );
});