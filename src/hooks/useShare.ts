import { useState, useCallback } from 'react';

interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

interface ShareResult {
  share: (options: ShareOptions) => Promise<void>;
  canShare: boolean;
  isSharing: boolean;
  shareError: string | null;
}

export function useShare(): ShareResult {
  const [isSharing, setIsSharing] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const share = useCallback(async (options: ShareOptions) => {
    setIsSharing(true);
    setShareError(null);
    
    try {
      if (canShare && navigator.share) {
        await navigator.share(options);
      } else {
        const shareText = `${options.text || ''}${options.url ? `\n\n${options.url}` : ''}`;
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        
        if (window.open(shareUrl, '_blank', 'width=600,height=400')) {
          console.log('Shared via Twitter fallback');
        } else {
          throw new Error('Failed to open share window');
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        setShareError(error.message);
        console.error('Share failed:', error);
      }
    } finally {
      setIsSharing(false);
    }
  }, [canShare]);

  return {
    share,
    canShare,
    isSharing,
    shareError
  };
}