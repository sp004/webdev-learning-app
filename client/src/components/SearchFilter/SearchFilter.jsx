import React from "react";
import { useState } from "react";
import { BsStar, BsStarFill } from "react-icons/bs";
import Rating from "react-rating";
import './SearchFilter.scss'
import { useRef } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useFetchCourses from "../../hooks/useFetchCourses";
import RatingFilter from "./FilterElement/RatingFilter";
import qs from 'query-string';
import LevelFilter from "./FilterElement/LevelFilter";
import { useCallback } from "react";
import CategoryFilter from "./FilterElement/CategoryFilter";
import { categoryFilters, levelFilters } from "../../utils/data";
import { BiMinus, BiPlus } from "react-icons/bi";

const SearchFilter = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLevelExpanded, setIsLevelExpanded] = useState(false)
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false)

  const navigate = useNavigate()

  const [searchParams] = useSearchParams();

  const changeHandler = (valueKey, id) => {
    const current = qs.parse(searchParams.toString());
    const query = {
      ...current,
      [valueKey]: id,
    };

    const url = qs.stringifyUrl({
      url: window.location.pathname,
      query,
    }, { skipNull: true });

    navigate(url)
  }

  return (
    <>
      <div className="filter-menu">
        <div className="filter-header">
          <h3>Ratings</h3>
          <span onClick={() => setIsExpanded(prev => !prev)}>
            {!isExpanded ? <BiPlus /> : <BiMinus />}
          </span>
        </div>

        <div className={`filter-options${!isExpanded ? '--open' : ''}`} onChange={(e) => changeHandler('rating', e.target.value)}>
          <RatingFilter ratingValue={4.5} />
          <RatingFilter ratingValue={4} />
          <RatingFilter ratingValue={3} />
        </div>
      </div>
      <hr />

      <div className="filter-menu">
        <div className="filter-header">
          <h3>Level</h3>
          <span onClick={() => setIsLevelExpanded(prev => !prev)}>
            {!isLevelExpanded ? <BiPlus /> : <BiMinus />}
          </span>
        </div>

        <div className={`filter-options${!isLevelExpanded ? '--open' : ''}`} onChange={(e) => changeHandler('level', e.target.value)}>
          {levelFilters.map(item => (
            <LevelFilter key={item?.id} level={item?.level} id={item?.id} />
          ))}
        </div>
      </div>
      <hr />

      <div className="filter-menu">
        <div className="filter-header">
          <h3>Category</h3>
          <span onClick={() => setIsCategoryExpanded(prev => !prev)}>
            {!isCategoryExpanded ? <BiPlus /> : <BiMinus />}
          </span>
        </div>

        <div className={`filter-options${!isCategoryExpanded ? '--open' : ''}`} onChange={(e) => changeHandler('category', e.target.value)}>
          {categoryFilters.map(item => (
            <CategoryFilter key={item?.id} category={item?.category} id={item?.id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchFilter;
