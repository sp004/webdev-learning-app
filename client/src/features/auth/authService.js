import { axiosPublic } from "../../api/apiMethod"

export const registerUser = async(user) => {
    const response = await axiosPublic.post('/auth/register', user)
    console.log(response.data)
    return response.data
}

//user clicks continue on login page to generate otp
export const loginUser = async(data) => {
    const {email, otp} = data
    const response = await axiosPublic.post(`/auth/loginWithOtp/${email}`, {otp}, { withCredentials: true })
    console.log(response.data)
    return response.data
}

export const googleLogin = async(data) => {
    const response = await axiosPublic.post(`/auth/google/callback`, data, { withCredentials: true })
    console.log(response.data)
    return response.data
}

export const logoutUser = async() => {
    const response = await axiosPublic.get('/auth/logout', {withCredentials: true})
    console.log(response.data)
    return response.data
}

export const getUser = async() => {
    const response = await axiosPublic.get('/user/profile', {withCredentials: true})
    // console.log(response)
    return response.data
}

export const editUser = async(data) => {
    const response = await axiosPublic.patch('/user/edit', data, {withCredentials: true})
    console.log(response.data)
    return response.data
}