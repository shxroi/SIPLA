import React from 'react';

function StarRating({ rating, onRatingChange, readOnly }) {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          style={{ 
            cursor: readOnly ? 'default' : 'pointer',
            color: star <= rating ? '#ffc107' : '#e4e5e9',
            fontSize: '1.25rem',
            marginRight: '0.25rem'
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
