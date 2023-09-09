import moment from "moment";
import React, { useEffect, useState } from "react";
import './CourseDetailsHeader.scss'
import { BsStar, BsStarFill } from "react-icons/bs";
import Rating from "react-rating";
import { axiosPublic } from "../../../api/apiMethod";
import { useNavigate } from "react-router-dom";

const CourseDetailsHeader = ({ course, avgRating, noOfRatings, isMobile=false }) => {
  // const [active, setActive] = useState(false);
  const [enrollmentCount, setEnrollmentCount] = useState(undefined)
  const navigate = useNavigate()

  // const isActive = () => {
  //   window.scrollY > 200 ? setActive(true) : setActive(false);
  // };

  // useEffect(() => {
  //   window.addEventListener("scroll", isActive);
  //   return () => {
  //     window.removeEventListener("scroll", isActive);
  //   };
  // }, []);
// console.log(course?.fullName.toLowerCase().split(' ').join(''))

  useEffect(() => {
    const fetchTotalEnrolledStudents = async () => {
      if(course?._id){
        try {
          const {data} = await axiosPublic.get(`/enrolledCourse/enrollmentCount/${course?._id}`)
          console.log("🚛🚜", data?.data)
          setEnrollmentCount(data?.data)
        } catch (error) {
          console.log(error?.response?.data)
        }
      }
    }
    fetchTotalEnrolledStudents()
  }, [course?._id])
// console.log("💜💤", avgRating, enrollmentCount)
  const bestSelllerTag = (avgRating >= 4.5 && noOfRatings >= 2) ? "Bestseller" : ""

  const coursePurchaseHandler = () => {
    navigate("/checkout", { state: [course] });
  }

  return (
    <div className="course-details--header">
      <div className="course-details--info">
        <h1 className="course-details--title">{course?.title}</h1>
        <p className="course-details--desc">{course?.description}</p>
        <div className="course-enrollment--header">
          {bestSelllerTag && <div className="course-tag">{bestSelllerTag}</div>}
          {!isNaN(avgRating) && <span className="course-rating--header star-icon--light">
            <h4>{avgRating}</h4>{" "}
            <Rating
              emptySymbol={<BsStar className="star-icon--light" size={12} />}
              fullSymbol={<BsStarFill className="star-icon--light" size={12} />}
              fractions={2}
              initialRating={avgRating}
              readonly
            />
          </span>}
          {noOfRatings !== 0 && <a className="review-hyperlink" href='#reviews'>({noOfRatings} ratings)</a>}
          {(enrollmentCount !== 0 && enrollmentCount) && <span>{enrollmentCount} {enrollmentCount === 1 ? 'student ' : 'students '}enrolled</span>}
        </div>
        <div className="additional-info">
          <p>
            Created by{" "}
            <a href={`#${course?.createdBy?.fullName?.toLowerCase().split(' ').join('')}`} >
              {course?.createdBy?.fullName}
            </a>
          </p>
          <p>
            Uploaded on: {moment(course?.uploadedOn).format("MM/YYYY")}
          </p>
        </div>
      </div>

      {/* {isMobile && <div className='course-purchase__container'>
        <div className="course-purchase--button">
          <h3>₹{course?.price}</h3>
          <button onClick={coursePurchaseHandler}>Buy Now</button>
        </div>
      </div>} */}
    </div>
  );
};

export default CourseDetailsHeader;
