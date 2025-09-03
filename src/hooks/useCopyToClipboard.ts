import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copyToClipboard: (text: string) => Promise<void>;
  isCopied: boolean;
  error: Error | null;
}

export const useCopyToClipboard = (): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      setError(new Error('Clipboard not supported'));
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setError(null);
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      setIsCopied(false);
    }
  }, []);

  return { copyToClipboard, isCopied, error };
};