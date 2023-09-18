import React from "react";
import './CourseAction.scss'
import CourseThumbnail from "./CourseThumbnail";
import CourseActionInfo from "./CourseActionInfo";

export const customStyles = {
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    border: "none",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
};

const CourseAction = ({ course, isScrollDown }) => {

  return (
    <div className={`course-action ${isScrollDown ? 'course-action--fixed' : ''}`}>
      <div className="desktop-only--action">
        <CourseThumbnail course={course} />
        <CourseActionInfo course={course} />
      </div>
    </div>
  );
};

export default CourseAction;
