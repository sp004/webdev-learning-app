import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosPublic } from "../../../api/apiMethod";
import { IoMdClose } from "react-icons/io";

const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const [suggestedResults, setSuggestedResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const { course, isSuccess, message } = useSelector((state) => state.course);

  const navigate = useNavigate();

  const debounce = (func, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  useEffect(() => {
    const fetchAllCourses = async () => {
      if (query !== "") {
        const { data } = await axiosPublic.get(
          `/course/courses?keyword=${query}`,
          { withCredentials: true }
        );
        setSuggestedResults(data?.data);
      } else {
        setSuggestedResults([]);
      }
    };
    // Debounce the fetchAllCourses function to limit API calls with each key stroke
    const delayedFetchAllCourses = debounce(fetchAllCourses, 500); // Adjust the delay as needed (e.g., 300ms)
    delayedFetchAllCourses();

    // Cleanup function to clear the timeout on component unmount
    return () => clearTimeout(delayedFetchAllCourses);
  }, [query]);

  const courseHandler = (course) => {
    setQuery("");
    navigate(`/course/${course._id}`);
  };

  const searchHandler = async (e) => {
    e.preventDefault();
    console.log(query);
    navigate(`/course/search?query=${query}`);
    setQuery("");
    setSuggestedResults([]);
    // try {
    //     const {data} = await axiosPublic.get(`/course/search?title=${query}`, {withCredentials: true})
    //     console.log("♈🚫", data)
    //     setSearchedCourses(data?.course)
    //     data?.success && navigate(`/course/search?q=${query}`)
    //     // if(data){
    //     //     navigate(`/course/${course?._id}`)
    //     // }
    // } catch (error) {
    //     console.log(error?.response?.data)
    // }
  };
  console.log("🤬🤬🤬", suggestedResults);

  return (
    <div className="search-container">
      <form role="search" onSubmit={searchHandler} className="search_form">
        <input
          type="search"
          className="search_form--input"
          aria-label="Search Course by keyword"
          aria-describedby="Search any course or a keyword specific to course title or description"
          placeholder="Search Course"
          autoComplete="off"
          autoCorrect="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {/* {query && (
          <IoMdClose
            className="search_form--close-icon"
            onClick={() => setQuery("")}
          />
        )} */}

      <>
        {suggestedResults?.length > 0 && (
          <ul>
            {suggestedResults?.map((course, index) => {
              return (
                <li
                  key={course?._id}
                  onClick={() => courseHandler(course)}
                  className={index === selectedIndex ? "selected" : ""}
                >
                  <img src={course?.thumbnail} alt={course?.title} />
                  <div className="course-info">
                    <p className="course-info--title">{course?.title}</p>
                    <p className="course-info--instructor">
                      {course?.createdBy?.fullName}
                    </p>
                  </div>
                </li>
              );
            })}
            <li onClick={(e) => searchHandler(e)}>
              Search course <b>{query}</b>
            </li>
          </ul>
        )}
      </>
    </div>
  );
};

export default NavbarSearch;
