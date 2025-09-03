import { memo } from 'react';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  label?: string;
}

export const FavoriteButton = memo<FavoriteButtonProps>(({ 
  isFavorite, 
  onClick, 
  size = 'medium',
  showLabel = false,
  label
}) => {
  return (
    <button
      onClick={onClick}
      className={`favorite-button favorite-button-${size} ${isFavorite ? 'is-favorite' : ''}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className="favorite-icon">
        {isFavorite ? '★' : '☆'}
      </span>
      {showLabel && label && (
        <span className="favorite-label">{label}</span>
      )}
    </button>
  );
});