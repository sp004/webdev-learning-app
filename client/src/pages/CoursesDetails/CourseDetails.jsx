import React, { useCallback, useEffect, useState } from "react";
import "react-accessible-accordion/dist/fancy-example.css";
import { CourseDetailsHeader, MeetYourInstructor, Reviews, CourseAction, CourseContent, Feedback, CourseThumbnail, CourseActionInfo, CoursePurchaseAction } from "../../components";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCourse } from "../../features/course/courseSlice";
import Modal from 'react-modal'
import './CourseDetails.scss'
import { axiosPublic } from "../../api/apiMethod";
import { toast } from "react-hot-toast";
import useDocumentTitle from "../../hooks/useDocumentTitle";
// import useCheckEnrolled from "../../hooks/useCheckEnrolled";
Modal.setAppElement("#root")

const CourseDetails = () => {
  const [isScrollDown, setIsScrollDown] = useState(false)
  const dispatch = useDispatch();

  const courseId = useLocation().pathname.split("/")[2];
  // const { course } = useSelector((state) => state.course);
  
  const [reviews, setReviews] = useState([])
  const [course, setCourse] = useState([])
  // const [isEnrolled, setIsEnrolled] = useState()

  // const isEnrolled = useCheckEnrolled(courseId)

  const scrollDown = useCallback(() => {
    window.scrollY > 200 ? setIsScrollDown(true) : setIsScrollDown(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", scrollDown);
    return () => window.removeEventListener("scroll", scrollDown);
  }, []);
  
  // get course details from the courseID
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const {data} = await axiosPublic.get(`/course/${courseId}`, {withCredentials: true})
        // console.log("😂", data)
        setCourse(data?.course)
      } catch (error) {
        toast.error('Something went wrong')
        console.log(error)
      }
    }
    fetchCourse()
  }, [courseId, dispatch]);

  //fetch rating and review for the course
  useEffect(() => {
    console.log("🥵🥵")
    const fetchReviews = async () => {
      const {data} = await axiosPublic.get(`/review/allReviews/${courseId}`)
      console.log("💩😺", data?.data)
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
// console.log(ratingsByCount)
// const ratingsByCount = allRatings?.reduce((accumulator, currentRating) => {
//     const star = Math.ceil(currentRating); // Round up to the nearest integer
//     const index = star - 1;
//     if (!accumulator[index]) {
//       accumulator[index] = { rating: star, count: 0 };
//     }
//     accumulator[index].count += 1;
//     return accumulator;
//   }, []);
  // const filteredRatingByCount = ratingsByCount.filter((entry) => entry)
  // console.log("🏀🥎", filteredRatingByCount);
  const totalRating = reviews?.reduce((r, cv) => r + cv?.rating, 0)
  const avgRating = (totalRating/reviews?.length).toFixed(1)
  // console.log("🥚🌯", totalRating, avgRating)
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
          {/* <div> */}
            <CourseAction course={course} isScrollDown={isScrollDown} />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
