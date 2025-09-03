import { Language, Translation } from '../types/i18n';

export class I18nService {
  private static readonly translations: Record<Language, Translation> = {
    ko: {
      appTitle: 'Wisdom Whispers',
      appSubtitle: '위대한 마음이 당신에게 영감을 줍니다',
      getNewQuote: '새로운 명언',
      copy: '📋 복사',
      copied: '✓ 복사됨!',
      share: '공유',
      tweet: '🐦 트윗',
      shareThisWisdom: '이 지혜를 공유하세요',
      loading: '로딩 중...',
      error: '오류 발생',
      retry: '다시 시도',
      errorMessage: '명언을 가져오는 중 오류가 발생했습니다',
      retryExhausted: '여러 번 시도했지만 실패했습니다. 나중에 다시 시도해주세요.',
      footer: '✨ 한 번에 하나의 명언으로 마음을 영감시킵니다 • 💜와 React로 제작',
      new: '새로고침',
      email: '이메일',
      close: '닫기',
      savedQuotes: '저장된 명언',
      allQuotes: '모든 명언',
      favorites: '즐겨찾기',
      noSavedQuotes: '저장된 명언이 없습니다',
      noFavorites: '즐겨찾기한 명언이 없습니다',
      clearAll: '모두 삭제',
      save: '💾 저장',
      saved: '✓ 저장됨!',
      viewSaved: '📚 보관함',
      today: '오늘',
      yesterday: '어제',
      daysAgo: '일 전',
      weeksAgo: '주 전',
      monthsAgo: '개월 전',
      yearsAgo: '년 전'
    },
    en: {
      appTitle: 'Daily Jokes',
      appSubtitle: 'Where laughter meets wisdom',
      getNewQuote: 'Get New Joke',
      copy: '📋 Copy',
      copied: '✓ Copied!',
      share: 'Share',
      tweet: '🐦 Tweet',
      shareThisWisdom: 'Share this joke',
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      errorMessage: 'Failed to fetch a joke',
      retryExhausted: 'Multiple attempts failed. Please try again later.',
      footer: '✨ Inspiring minds, one joke at a time • Built with 💜 and React',
      new: 'New',
      email: 'Email',
      close: 'Close',
      savedQuotes: 'Saved Quotes',
      allQuotes: 'All Quotes',
      favorites: 'Favorites',
      noSavedQuotes: 'No saved quotes yet',
      noFavorites: 'No favorite quotes yet',
      clearAll: 'Clear All',
      save: '💾 Save',
      saved: '✓ Saved!',
      viewSaved: '📚 Library',
      today: 'Today',
      yesterday: 'Yesterday',
      daysAgo: ' days ago',
      weeksAgo: ' weeks ago',
      monthsAgo: ' months ago',
      yearsAgo: ' years ago'
    }
  };

  static getTranslation(language: Language): Translation {
    return this.translations[language];
  }

  static getAvailableLanguages(): Language[] {
    return Object.keys(this.translations) as Language[];
  }

  static getLanguageLabel(language: Language): string {
    const labels: Record<Language, string> = {
      ko: '한국어',
      en: 'English'
    };
    return labels[language];
  }

  static detectUserLanguage(): Language {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ko')) {
      return 'ko';
    }
    return 'en';
  }

  static saveLanguagePreference(language: Language): void {
    localStorage.setItem('preferredLanguage', language);
  }

  static getLanguagePreference(): Language {
    const saved = localStorage.getItem('preferredLanguage') as Language;
    return saved || this.detectUserLanguage();
  }
}