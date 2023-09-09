import { useEffect, useState } from "react";
import { axiosPublic } from "../api/apiMethod";

const useFetchCourses = (url) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
console.log(url)
useEffect(() => {
    const fetchCourses = async () => {
        setLoading(true);
        try {
          const {data} = await axiosPublic.get(url);
          console.log("🎡👕", data?.course)
          setCourses(data?.course);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [url]);
// console.log(courses)
  const reFetch = async () => {
    setLoading(true);
    try {
      const {data} = await axiosPublic.get(url);
      setCourses(data?.course);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { courses, loading, error, reFetch };
};

export default useFetchCourses;