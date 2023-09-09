import axios from "axios";

export const axiosPublic = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    withCredentials: true
})

export const axiosPrivate = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000'
    },
    withCredentials: true
}) 