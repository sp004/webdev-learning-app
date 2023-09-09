import React from "react";
import "./OtherCourses.scss";
import CourseCard from "../../CourseCard/CourseCard";

const OtherCourses = ({ otherCourses }) => {
  return (
    <div className="other-courses--wrapper">
      {otherCourses?.map((course) => (
        <div key={course?._id} className="other-courses">
          <CourseCard key={course?._id} courseItem={course} />
        </div>
      ))}
    </div>
  );
};

export default OtherCourses;
