import React from "react";
import "./CoursePurchaseAction.scss";
import Rating from "react-rating";
import { BsStar, BsStarFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import useCheckEnrolled from "../../../hooks/useCheckEnrolled";

const CoursePurchaseAction = ({ course, avgRating, noOfRatings }) => {
    const { isEnrolled } = useCheckEnrolled(course._id);
    const navigate = useNavigate()

    const coursePurchaseHandler = () => {
        navigate("/checkout", { state: [course] });
    }

  return (
    <>
        {!isEnrolled && <div className="course-purchase__container">
        <div className="course-purchase__wrapper">
            <div className="course-info">
                <p className="course-details--title">{course?.title}</p>
                <div className="course-enrollment--header">
                {!isNaN(avgRating) && (
                    <span className="course-rating--header star-icon--light">
                        <h4>{avgRating}</h4>{" "}
                        <Rating
                            emptySymbol={<BsStar className="star-icon--light" size={12} />}
                            fullSymbol={
                            <BsStarFill className="star-icon--light" size={12} />
                            }
                            fractions={2}
                            initialRating={avgRating}
                            className="sticky-star--icons"
                            readonly
                        />
                    </span>
                )}
                {noOfRatings !== 0 && (
                    <a className="review-hyperlink" href="#reviews">
                        ({noOfRatings} ratings)
                    </a>
                )}
                </div>
            </div>

            <div className='course-purchase--info'>
                <h2>₹{course?.price}</h2>
                <button className="course-purchase--button" onClick={coursePurchaseHandler}>Buy Now</button>
            </div>
            
        </div>
        </div>}
    </>
  );
};

export default CoursePurchaseAction;
