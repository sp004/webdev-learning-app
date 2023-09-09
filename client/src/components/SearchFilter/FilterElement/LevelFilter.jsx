import React from "react";

const LevelFilter = ({ level, id }) => { 
  return (
    <div className="filter-option">
      <input type="radio" name="level" id={`filter-level-${id}`} value={id} />
      <label htmlFor={`filter-level-${id}`} className="filter-rating_label" aria-label={`${level} level`}>
        {level}
      </label>
    </div>
  );
};

export default LevelFilter;
