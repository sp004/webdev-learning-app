import { axiosPublic } from "../../api/apiMethod"

export const fetchInstructor = async (id) => {
    const response = await axiosPublic.get(`/instructor/profile/${id}`, {withCredentials: true})
    // console.log(response.data)
    return response.data
}

export const updateInstructor = async () => {
    const response = await axiosPublic.patch(`/instructor/edit`, {withCredentials: true})
    // console.log(response.data)
    return response.data
}