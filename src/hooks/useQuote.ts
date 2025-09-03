import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { ApiError } from '../types/index';
import { Language } from '../types/i18n';

interface UseQuoteState {
  quote: string | null;
  loading: boolean;
  error: ApiError | null;
  fetchNewQuote: () => Promise<void>;
  retryCount: number;
}

export const useQuote = (language: Language): UseQuoteState => {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchNewQuote = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await apiService.fetchQuote(language);

    if (result.success) {
      setQuote(result.data);
      setRetryCount(0);
    } else {
      setError(result.error);
      setRetryCount(prev => prev + 1);
    }

    setLoading(false);
  }, [language]);

  useEffect(() => {
    fetchNewQuote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // 언어 변경시 새로운 quote 로드

  return {
    quote,
    loading,
    error,
    fetchNewQuote,
    retryCount,
  };
};