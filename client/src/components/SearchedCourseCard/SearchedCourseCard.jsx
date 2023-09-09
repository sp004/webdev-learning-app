import React from "react";
import "./SearchedCourseCard.scss";
import { BsStar, BsStarFill } from "react-icons/bs";
import Rating from "react-rating";
import { useNavigate } from "react-router-dom";

const SearchedCourseCard = ({ courses }) => {
  const navigate = useNavigate()
  
  return (
    <div className="search-courses">
      {courses?.map((course) => (
        <div className="search-course_card" key={course?._id} onClick={() => navigate(`/course/${course._id}`)}>
          <div className="search-course_card--left">
            <img src={course?.thumbnail} alt={course?.title} />
            <div className="search-course_detail">
              <p className="search-course_detail--title">{course?.title}</p>
              <p className="search-course_detail--desc">{course?.description}</p>

              <div className="search-course_detail--lower">
                {course?.avgRating !== 0 && <>
                  <p className="search-course_rating">{course?.avgRating?.toFixed(1)}</p>
                  <Rating
                    emptySymbol={<BsStar className="star-icon" size={12} />}
                    fullSymbol={<BsStarFill className="star-icon" size={12} />}
                    fractions={2}
                    initialRating={course?.avgRating}
                    readonly
                  />
                </>}
                <span className="search-course_level">• {course?.level} •</span>
                <span className="search-course_category">{course?.category}</span>
              </div>
            </div>
          </div>
          <div className="search-course_card--right">
            <h3 className="search-course_price">₹{course?.price}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchedCourseCard;
