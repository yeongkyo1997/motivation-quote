import { memo } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = memo<ConfirmDialogProps>(({ 
  isOpen, 
  message, 
  confirmText = '확인',
  cancelText = '취소',
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="confirm-overlay" onClick={onCancel} />
      <div className="confirm-dialog">
        <div className="confirm-message">{message}</div>
        <div className="confirm-buttons">
          <button 
            className="confirm-button confirm-button--cancel" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className="confirm-button confirm-button--confirm" 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
});