import { useEffect, useRef } from 'react';
import { ShareService } from '../services/share.service';
import { useI18n } from '../contexts/I18nContext';
import './ShareModal.css';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  url?: string;
}

export function ShareModal({ isOpen, onClose, text, url = window.location.href }: ShareModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const platforms = ShareService.getPlatforms();

  const handleShare = (platform: string) => {
    ShareService.shareToPlatform(platform, text, url);
    onClose();
  };

  return (
    <div className="share-modal-overlay" aria-modal="true" role="dialog">
      <div className="share-modal" ref={modalRef}>
        <div className="share-modal-header">
          <h2>{t.shareThisWisdom}</h2>
          <button 
            onClick={onClose} 
            className="share-modal-close"
            aria-label="Close share dialog"
          >
            ✕
          </button>
        </div>
        <div className="share-modal-content">
          <p className="share-preview">{text}</p>
          <div className="share-platforms">
            {platforms.map(platform => {
              const info = ShareService.getPlatformInfo(platform);
              return (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  className={`share-platform-button share-platform-${platform}`}
                  aria-label={`Share on ${info?.name}`}
                >
                  <span className="share-platform-icon">{info?.icon}</span>
                  <span className="share-platform-name">{info?.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}