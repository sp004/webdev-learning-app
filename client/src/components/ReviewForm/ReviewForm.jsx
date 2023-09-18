import React, { useEffect, useState } from "react";
import "./ReviewForm.scss";
import { axiosPublic } from "../../api/apiMethod";
import { AiOutlineCloseCircle } from "react-icons/ai";
import Rating from "react-rating";
import { BsStar, BsStarFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ReviewForm = ({ courseId, toggleModal, rating, review, reviewId, i }) => {
  const [myRating, setMyRating] = useState(rating ? rating : null);
  const [myReview, setMyReview] = useState(review);
  const [error, setError] = useState("");
  const [ratingPlaceholder, setRatingPlaceholder] = useState("");

  const queryClient = useQueryClient();

  //submit review and rating
  const createReviewMutation = useMutation({
    mutationFn: async (e) => {
      return await axiosPublic.post(`/review/post/${courseId}`, {
        rating: myRating,
        review: myReview,
      });
    },
    onSuccess: () => {
      toggleModal(i)
      queryClient.invalidateQueries({ queryKey: ['myCourses'] })
    },
    onError: (error) => {
      if(error.response.status !== 500){
        toast.error(error?.response.data.message);
        return
      }
      toast.error("Something went wrong, please try again later");
    }
  })

  const reviewSubmitHandler = (e) => {
    e.preventDefault();
    createReviewMutation.mutate()
  };

  const editReviewMutation = useMutation({
    mutationFn: async () => {
      return await axiosPublic.put(`/review/edit/${reviewId}`, {
        rating: myRating,
        review: myReview,
      })
    },
    onSuccess: ({data}) => {
      toggleModal(i)
      queryClient.invalidateQueries({ queryKey: ['myCourses'] })
    },
  })

  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      return await axiosPublic.delete(`/review/delete/${reviewId}`)
    },
    onSuccess: () => {
      toggleModal(i)
      queryClient.invalidateQueries({ queryKey: ['myCourses'] })
    },
  })

  useEffect(() => {
    if (0 < myRating && myRating <= 1) {
      setRatingPlaceholder("Awful");
    } else if (1 < myRating && myRating <= 2) {
      setRatingPlaceholder("Poor");
    } else if (2 < myRating && myRating <= 3) {
      setRatingPlaceholder("Average");
    } else if (3 < myRating && myRating <= 4) {
      setRatingPlaceholder("Good");
    } else if (4 < myRating && myRating <= 5) {
      setRatingPlaceholder("Excellent");
    } else {
      setRatingPlaceholder("");
    }
  }, [myRating])

  return (
    <div className="review-form--container">
      <form onSubmit={reviewSubmitHandler} className="review-form">
        <AiOutlineCloseCircle
          className="close-icon"
          onClick={() => toggleModal(i)}
        />
        <div className="my-rating">
          <h2>How would you rate this course?</h2>
          <h4>{ratingPlaceholder}</h4>
          <Rating
            emptySymbol={<BsStar className="star-icon" size={30} />}
            fullSymbol={<BsStarFill className="star-icon" size={30} />}
            fractions={2}
            initialRating={myRating}
            onClick={(value) => setMyRating(value)}
            // onChange={(value) => ratingPlaceholderHandler(value)}
            required
          />
        </div>
        {(ratingPlaceholder || rating) && (
          <textarea
            rows={5}
            placeholder="Tell us about your own personal experience taking this course. Was it a good match for you?"
            name="myReview"
            value={myReview}
            onChange={(e) => setMyReview(e.target.value)}
            required
          />
        )}
        <div className="profile-button--container">
          {rating 
          ? 
          <>
            <input type="button" value="Edit Review" className="review-save--button" onClick={() => editReviewMutation.mutate()} />
            {/* <button className="review-save--button" onClick={(reviewId) => editReviewHandler(reviewId)}>Edit Review</button> */}
            <input type="button" className="review-delete--button" value='Delete' onClick={() => deleteReviewMutation.mutate()} />
          </>
          : <button className="review-save--button">Save & Continue</button>
          }
        </div>
        {/* {error && (
          <h5 style={{ color: "red", textAlign: "center" }}>{error}</h5>
        )} */}
      </form>
    </div>
  );
};

export default ReviewForm;
