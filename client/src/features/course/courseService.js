import { axiosPublic } from "../../api/apiMethod"

export const getCoursesByInstructor = async (instructorId) => {
    const response = await axiosPublic.get(`/course/coursesByInstructor/${instructorId}`, {withCredentials: true})
    return response.data
}

export const fetchCoursesByTitle = async (title) => {
    const response = await axiosPublic.get(`/course/search?title=${title}`, {withCredentials: true})
    // console.log(response.data)
    return response.data
}
