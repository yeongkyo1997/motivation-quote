import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(({ 
  size = 'medium', 
  className = '' 
}) => {
  return (
    <div 
      className={`loading-spinner loading-spinner--${size} ${className}`}
      role="status" 
      aria-label="Loading"
    >
      <span className="spinner"></span>
      <span className="sr-only">Loading...</span>
    </div>
  );
});