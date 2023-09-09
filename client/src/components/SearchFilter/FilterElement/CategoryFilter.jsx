import React from 'react'

const CategoryFilter = ({category, id}) => {
  return (
    <div className="filter-option">
      <input type="radio" name="category" id={`filter-category-${id}`} value={`${id}`} />
      <label htmlFor={`filter-category-${id}`} className="filter-option_label" aria-label={`${category}`}>
        {category}
      </label>
    </div>
  )
}

export default CategoryFilter