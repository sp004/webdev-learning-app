import { useEffect, useState } from "react";
import { axiosPublic } from "../api/apiMethod";

const useFetchCourses = (url) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

useEffect(() => {
    const fetchCourses = async () => {
        setLoading(true);
        try {
          const {data} = await axiosPublic.get(url);
          setCourses(data?.course);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [url]);

  return { courses, loading, error };
};

export default useFetchCourses;