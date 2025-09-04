import { ApiResult, QuoteResponse } from '../types/index';
import { Language } from '../types/i18n';

interface ApiService {
  fetchQuote(language: Language): Promise<ApiResult<string>>;
}

class QuoteApiService implements ApiService {
  private readonly koreanUrl = '/api/quote';
  private readonly englishUrl = 'https://random-quotes-freeapi.vercel.app/api/random';
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
      if (language === 'ko') {
        const koreanResponse = result as QuoteResponse;
        if (!Array.isArray(koreanResponse) || koreanResponse.length < 2) {
          return {
            success: false,
            error: {
              message: 'Invalid response format',
              code: 'INVALID_RESPONSE',
            },
          };
        }
        const statusObj = koreanResponse[0] as {result?: string};
        const quoteObj = koreanResponse[1] as {respond?: string};
        
        if (statusObj.result !== 'success' || !quoteObj.respond) {
          return {
            success: false,
            error: {
              message: 'Failed to fetch quote',
              code: 'FETCH_FAILED',
            },
          };
        }
        quote = quoteObj.respond;
      } else {
        // New API returns {quote: string, author: string, id: number}
        const englishQuote = result.quote || 'No quote available';
        const author = result.author || 'Unknown';
        quote = `${englishQuote} - ${author}`;
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