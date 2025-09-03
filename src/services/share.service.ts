interface SharePlatform {
  name: string;
  url: (text: string, pageUrl: string) => string;
  icon?: string;
}

export class ShareService {
  private static readonly platforms: Record<string, SharePlatform> = {
    twitter: {
      name: 'Twitter',
      url: (text: string, pageUrl: string) => 
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`,
      icon: '🐦'
    },
    facebook: {
      name: 'Facebook',
      url: (text: string, pageUrl: string) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(text)}`,
      icon: '📘'
    },
    linkedin: {
      name: 'LinkedIn',
      url: (text: string, pageUrl: string) => 
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}&summary=${encodeURIComponent(text)}`,
      icon: '💼'
    },
    whatsapp: {
      name: 'WhatsApp',
      url: (text: string, pageUrl: string) => 
        `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${pageUrl}`)}`,
      icon: '💬'
    },
    telegram: {
      name: 'Telegram',
      url: (text: string, pageUrl: string) => 
        `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(text)}`,
      icon: '✈️'
    },
    email: {
      name: 'Email',
      url: (text: string, pageUrl: string) => 
        `mailto:?subject=${encodeURIComponent('Wisdom Whispers - Inspirational Quote')}&body=${encodeURIComponent(`${text}\n\nRead more at: ${pageUrl}`)}`,
      icon: '✉️'
    }
  };

  static shareToPlatform(platform: string, text: string, pageUrl: string = window.location.href): boolean {
    const shareOption = this.platforms[platform];
    if (!shareOption) {
      console.error(`Platform ${platform} not supported`);
      return false;
    }

    const shareUrl = shareOption.url(text, pageUrl);
    const windowOptions = platform === 'email' ? '' : 'width=600,height=400,menubar=no,toolbar=no';
    
    const result = window.open(shareUrl, '_blank', windowOptions);
    return result !== null;
  }

  static getPlatforms(): string[] {
    return Object.keys(this.platforms);
  }

  static getPlatformInfo(platform: string): SharePlatform | undefined {
    return this.platforms[platform];
  }

  static async nativeShare(title: string, text: string, url?: string): Promise<boolean> {
    if (!navigator.share) {
      return false;
    }

    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }
}