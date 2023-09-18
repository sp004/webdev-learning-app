import React, { useState } from "react";
import "./CourseAction.scss";
import Modal from "react-modal";
import { BiPlayCircle } from "react-icons/bi";
import useCheckEnrolled from "../../../hooks/useCheckEnrolled";
import { customStyles } from "./CourseAction";
Modal.setAppElement("#root");

const CourseThumbnail = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isEnrolled } = useCheckEnrolled(course._id);

  return (
    <>
      <div
        className={`course-thumbnail`}
        style={{ cursor: `${isEnrolled ? "pointer" : "not-Allowed"}` }}
        onClick={() => setIsModalOpen(true)}
      >
        <img src={course?.thumbnail} alt={course?.title} />
        <div className="course-play_icon">
          <BiPlayCircle />
        </div>
        <div className="thumbnail-fade"></div>
      </div>

      {isEnrolled && (
        <Modal
          isOpen={isModalOpen}
          style={customStyles}
          // className={isEnrolled ? 'enrolled' : ''}
          shouldCloseOnOverlayClick={() => setIsModalOpen((prev) => !prev)}
          onRequestClose={() => setIsModalOpen(false)}
        >
          <video
            src={course?.video}
            style={{ height: "100%", width: "100%" }}
            autoPlay
            controls
          ></video>
        </Modal>
      )}
    </>
  );
};

export default CourseThumbnail;
