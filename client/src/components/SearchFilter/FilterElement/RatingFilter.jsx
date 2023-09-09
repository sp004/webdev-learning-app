import React from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import Rating from "react-rating";

const RatingFilter = ({ ratingValue }) => {
  return (
    <div className="filter-option">
      <input
        type="radio"
        name="rating"
        id={`filter-rating-${ratingValue}`}
        value={`${ratingValue}`}
      />
      <label
        htmlFor={`filter-rating-${ratingValue}`}
        aria-label="Rating Filter"
        className="filter-option_label"
      >
        <Rating
          fullSymbol={<BsStarFill className="star-icon" size={15} />}
          emptySymbol={<BsStar className="star-icon" size={15} />}
          initialRating={ratingValue}
          readonly
          className="filter-option_icon"
        />
        <span>{ratingValue} & up</span>
      </label>
    </div>
  );
};

export default RatingFilter;
