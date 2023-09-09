import { axiosPublic } from "../../api/apiMethod"

// export const fetchCourse = async(courseId) => {
//     const response = await axiosPublic.get(`/course/${courseId}`, {withCredentials: true})
//     return response.data
// }

// export const fetchAllCourses = async () => {
//     const response = await axiosPublic.get('/course/courses', {withCredentials: true})
//     // console.log(response.data)
//     return response.data
// }

export const getCoursesByInstructor = async (instructorId) => {
    const response = await axiosPublic.get(`/course/coursesByInstructor/${instructorId}`, {withCredentials: true})
    // console.log(response.data)
    return response.data
}

export const fetchCoursesByTitle = async (title) => {
    const response = await axiosPublic.get(`/course/search?title=${title}`, {withCredentials: true})
    // console.log(response.data)
    return response.data
}
