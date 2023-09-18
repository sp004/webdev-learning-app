import React from "react";
import "./Reviews.scss";
import { BsStar, BsStarFill } from "react-icons/bs";
import Rating from "react-rating";
import moment from "moment";
import deleted_user from '../../../assets/deleted_user.png'

const Reviews = ({ courseId, reviews, avgRating, noOfRatings }) => {

  return (
    <div className="course-review">
      <h2>Reviews</h2>
      <div className="course-rating">
        <h3>
          <BsStarFill className="star-icon" /> {avgRating} course rating • {noOfRatings} ratings
        </h3>
      </div>

      <div id='reviews' className="student-reviews">
        {reviews?.map((review, i) => (
          <div className="student-review" key={i}>
            <hr />
            <div className="student-info">
              <img src={review?.userId ? review?.userId?.avatar : deleted_user} alt={review?.userId ? review?.userId?.fullName : 'WebdevSkool User'} />
              <div className="student-rating">
                <h4>{review?.userId ? review?.userId?.fullName : 'Unnamed User'}</h4>
                <div className="student-rating--lower">
                  <Rating
                    emptySymbol={<BsStar className="star-icon" size={12} />}
                    fullSymbol={<BsStarFill className="star-icon" size={12} />}
                    fractions={2}
                    initialRating={review?.rating}
                    readonly
                  />
                  <span>
                    {moment(review?.reviewDate).fromNow()}
                  </span>
                </div>
              </div>
            </div>
            <div className="student-review">
              <p>{review?.review}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
