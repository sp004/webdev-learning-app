import React from "react";
import './CourseSection.scss';
import CourseCard from "../CourseCard/CourseCard";
import {Loader} from "../index";

const CourseSection = ({ heading, courses, loading }) => {
  return (
    <div className="courses-display">
      <h1>{heading}</h1>
      {loading
        ? <Loader loading={loading} />
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
