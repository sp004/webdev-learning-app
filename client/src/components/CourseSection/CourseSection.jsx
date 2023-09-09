import React from "react";
import './CourseSection.scss';
import CourseCard from "../CourseCard/CourseCard";

const CourseSection = ({ heading, courses }) => {
  return (
    <div className="courses-display">
      <h1>{heading}</h1>
      <div className="courses-container">
        {courses?.map((course, i) => {
          return (
            <CourseCard key={i} courseItem={course} />
          );
        })}
      </div>
    </div>
  );
};

export default CourseSection;
