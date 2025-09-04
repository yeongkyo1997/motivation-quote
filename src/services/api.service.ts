import { ApiResult, QuoteResponse } from '../types/index';
import { Language } from '../types/i18n';

interface ApiService {
  fetchQuote(language: Language): Promise<ApiResult<string>>;
}

class QuoteApiService implements ApiService {
  private readonly koreanUrl = 'https://api.quotable.io/random';
  private readonly englishUrl = 'https://api.quotable.io/random';
  private readonly timeout = 5000;

  async fetchQuote(language: Language): Promise<ApiResult<string>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = language === 'ko' ? this.koreanUrl : this.englishUrl;
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: `HTTP error! status: ${response.status}`,
            code: `HTTP_${response.status}`,
          },
        };
      }

      const result = await response.json();
      
      let quote: string;
      // Quotable API response format
      if (result.content && result.author) {
        quote = `${result.content} - ${result.author}`;
      } else {
        quote = result.content || result || 'No quote available';
      }

      return { success: true, data: quote };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: {
              message: 'Request timeout',
              code: 'TIMEOUT',
            },
          };
        }
        return {
          success: false,
          error: {
            message: error.message,
            code: 'NETWORK_ERROR',
          },
        };
      }
      
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
          code: 'UNKNOWN_ERROR',
        },
      };
    }
  }
}

export const apiService = new QuoteApiService();