import React from "react";
import './CourseSection.scss';
import CourseCard from "../CourseCard/CourseCard";
import Loading from "../Loading/Loading";

const CourseSection = ({ heading, courses, loading }) => {
  return (
    <div className="courses-display">
      <h1>{heading}</h1>
      {loading
        ? <Loading loading={loading} />
        : 
        <div className="courses-container">
          {courses?.map((course, i) => {
            return (
              <CourseCard key={i} courseItem={course} />
            );
          })}
        </div>
      }
    </div>
  );
};

export default CourseSection;
