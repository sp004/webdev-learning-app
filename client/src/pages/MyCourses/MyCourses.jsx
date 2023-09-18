import React, { useState } from "react";
import { SubNavbar, ReviewForm, Loading } from "../../components";
import { myCourseSubNavLinks } from "../../utils";
import { axiosPublic } from "../../api/apiMethod";
import { useNavigate } from "react-router-dom";
import "./MyCourses.scss";
import Modal from "react-modal";
import Rating from "react-rating";
import { BsStar, BsStarFill } from "react-icons/bs";
import { customStyles } from "../../components/CourseDetails/CourseAction/CourseAction";
import { useQuery } from "@tanstack/react-query";
import useDocumentTitle from "../../hooks/useDocumentTitle";
Modal.setAppElement("#root");

const MyCourses = () => {
  useDocumentTitle(`My Courses - Webdev Skool`)
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [modalOpenStatus, setModalOpenStatus] = useState([]);
  const perPage = 4;

  // Function to toggle modal open status for a card by index
  const toggleModal = (index, e) => {
    e?.stopPropagation();
    setModalOpenStatus((prev) => {
      const updatedStatus = [...prev];
      updatedStatus[index] = !updatedStatus[index];
      return updatedStatus;
    });
  };

  //fetch enrolled courses
  const getEnrolledCourses = async (currentPage = 1) => {
    const { data } = await axiosPublic.get(
      `/enrolledCourse/courses?page=${currentPage}`
    );
    if (data && data?.courses) {
      setTotalCourses(data?.totalCourses);
    }
    return data.courses;
  };

  const {
    data: enrolledCourses,
    isLoading,
    isError,
    error,
    isFetching,
    isPreviousData,
  } = useQuery({
    queryKey: ["myCourses", currentPage],
    queryFn: () => getEnrolledCourses(currentPage)
  });

  return (
    <>
      <SubNavbar title="My Learning" links={myCourseSubNavLinks} />

      <div className="wrapper">
        <section>
          {isLoading ? (
            <Loading loading={isLoading} />
          ) : (
            <>
              {(enrolledCourses?.length > 0 || error?.response?.status !== 404) ? (
                <>
                  <div className="course-card--container">
                    {enrolledCourses?.map((enrolledCourse, i) => (
                      <div key={enrolledCourse?.courseId._id}>
                        <div
                          className="mycourse-card"
                          onClick={() =>
                            navigate(`/course/${enrolledCourse?.courseId._id}`)
                          }
                        >
                          <div className="mycourse-card--thumbnail">
                            <img
                              src={enrolledCourse?.courseId?.thumbnail}
                              alt={enrolledCourse?.courseId?.title}
                            />
                          </div>
                          <div className="mycourse-card--info">
                            <h4>{enrolledCourse?.courseId?.title}</h4>
                            <p>
                              {enrolledCourse?.courseId?.createdBy?.fullName}
                            </p>
                          </div>

                          <div
                            className="coursecard-rating"
                            onClick={(e) => toggleModal(i, e)}
                          >
                            <Rating
                              readonly
                              emptySymbol={
                                <BsStar className="star-icon" size={12} />
                              }
                              fullSymbol={
                                <BsStarFill className="star-icon" size={12} />
                              }
                              initialRating={enrolledCourse?.myRating}
                            />
                            {!enrolledCourse?.review ? (
                              <span>Leave a rating</span>
                            ) : (
                              <span>Edit rating</span>
                            )}
                          </div>
                        </div>

                        {modalOpenStatus[i] && (
                          <Modal
                            isOpen={modalOpenStatus[i]}
                            style={customStyles}
                            shouldCloseOnOverlayClick={true}
                            onRequestClose={() => toggleModal(i)}
                          >
                            <ReviewForm
                              courseId={enrolledCourse?.courseId._id}
                              toggleModal={toggleModal}
                              rating={enrolledCourse?.myRating}
                              review={enrolledCourse?.review}
                              reviewId={enrolledCourse?.reviewId}
                              i={i}
                            />
                          </Modal>
                        )}
                      </div>
                    ))}
                    {isFetching ? (
                      <span className="empty-content">Loading...</span>
                    ) : null}{" "}
                  </div>
                  <div className="pagination">
                    <button
                      className={`page-link ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 0))
                      }
                      disabled={currentPage === 1}
                    >
                      &lt;
                    </button>

                    <div className="course-pagenumber">
                      {Array(Math.ceil(totalCourses / perPage))
                        ?.fill()
                        ?.map((_, i) => (
                          <button
                            key={i}
                            className={`page-link ${
                              currentPage === i + 1 ? "active" : ""
                            }`}
                            onClick={() => setCurrentPage(i + 1)}
                            disabled={isPreviousData}
                          >
                            {i + 1}
                          </button>
                        ))}
                    </div>

                    <button
                      className={`page-link ${
                        isPreviousData || currentPage * perPage >= totalCourses
                          ? "disabled"
                          : ""
                      }`}
                      onClick={() => {
                        if (
                          !isPreviousData &&
                          currentPage * perPage < totalCourses
                        ) {
                          setCurrentPage((prev) => prev + 1);
                        }
                      }}
                      disabled={
                        isPreviousData || currentPage * perPage >= totalCourses
                      }
                    >
                      &gt;
                    </button>
                  </div>
                  <p className="per_page-count">
                    {(currentPage - 1) * perPage + 1} -
                    {currentPage * perPage < totalCourses
                      ? currentPage * perPage
                      : totalCourses}{" "}
                    of {totalCourses} Courses
                  </p>
                </>
              ) : 
                <h1 className="empty-content">No enrolled courses yet</h1>
              }
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default MyCourses;
