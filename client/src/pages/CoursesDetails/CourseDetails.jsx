import React, { useCallback, useEffect, useState } from "react";
import "react-accessible-accordion/dist/fancy-example.css";
import { CourseDetailsHeader, MeetYourInstructor, Reviews, CourseAction, CourseContent, Feedback, CourseThumbnail, CourseActionInfo, CoursePurchaseAction } from "../../components";
import { useLocation } from "react-router-dom";
import { useDispatch} from "react-redux";
import Modal from 'react-modal'
import './CourseDetails.scss'
import { axiosPublic } from "../../api/apiMethod";
import { toast } from "react-hot-toast";
import useDocumentTitle from "../../hooks/useDocumentTitle";

Modal.setAppElement("#root")

const CourseDetails = () => {
  const dispatch = useDispatch();
  const courseId = useLocation().pathname.split("/")[2];
  const [isScrollDown, setIsScrollDown] = useState(false)
  const [reviews, setReviews] = useState([])
  const [course, setCourse] = useState([])

  const scrollDown = useCallback(() => {
    window.scrollY > 200 ? setIsScrollDown(true) : setIsScrollDown(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollDown);
    return () => window.removeEventListener("scroll", scrollDown);
  }, [scrollDown]);
  
  // get course details from the courseID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const {data} = await axiosPublic.get(`/course/${courseId}`, {withCredentials: true})
        setCourse(data?.course)
      } catch (error) {
        toast.error('Something went wrong')
      }
    }
    fetchCourse()
  }, [courseId, dispatch]);

  //fetch rating and review for the course
  useEffect(() => {
    const fetchReviews = async () => {
      const {data} = await axiosPublic.get(`/review/allReviews/${courseId}`)
      setReviews(data?.data)
    }
    fetchReviews()
  }, [courseId])

const allRatings = reviews.map((review) => review.rating)

const ratingsByCount = Array.from({ length: 5 }, (_, i) => {
  const star = i + 1;
  const count = allRatings.filter(value => Math.ceil(value) === star).length;
  return { star, count };
});

  const totalRating = reviews?.reduce((r, cv) => r + cv?.rating, 0)
  const avgRating = (totalRating/reviews?.length).toFixed(1)

  useDocumentTitle(`${course?.title} - Webdev Skool`)

  return (
    <div className="course-details__wrapper">
      <div className={isScrollDown ? "course-details__sticky-navbar" : "course-details__desktop-upper"}>
        <div>
          <div className="desktop-only--header">
            <CourseDetailsHeader course={course} avgRating={avgRating} noOfRatings={reviews?.length} />
          </div>
        </div>
      </div>

      <div className="course-details__mobile-upper">
        <div>
          <div className="mobile-only--header">
            <CourseThumbnail course={course} />
            <CourseDetailsHeader course={course} avgRating={avgRating} noOfRatings={reviews?.length} />
            <CourseActionInfo course={course} />
          </div>
        </div>
        <div className="mobile-only--course-purchase">
          <div className="sticky-purchase--bar">
            <CoursePurchaseAction course={course} avgRating={avgRating} noOfRatings={reviews?.length} />
          </div>
        </div>
      </div>
      
      <div className="course-details__lower">
        <div className="course-details__lower-left">
          <CourseContent course={course} />
          {avgRating > 0 && <Feedback avgRating={avgRating} ratingsByCount={ratingsByCount} totalReviewer={reviews?.length} />}
          {reviews?.length !== 0 && <Reviews courseId={course?._id} reviews={reviews} avgRating={avgRating} noOfRatings={reviews?.length} />}
          <MeetYourInstructor course={course} />
        </div>
        <div className="course-details__lower-right">
          <CourseAction course={course} isScrollDown={isScrollDown} />
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
