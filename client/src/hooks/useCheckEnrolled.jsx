import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { axiosPrivate, axiosPublic } from "../api/apiMethod"

const useCheckEnrolled = (courseId) => {
    const [isEnrolled, setIsEnrolled] = useState(false)
    const [enrolledDate, setEnrolledDate] = useState(null)
    const {currentUser} = useSelector(state => state.auth)

    useEffect(() => {
        if(currentUser?._id){
            setIsEnrolled(false)
            const fetchEnrolledDetails = async () => {
                const {data} = await axiosPublic.get(`/enrolledCourse/enrolledOn/${courseId}`)
                setEnrolledDate(data.data)
                data?.data && setIsEnrolled(true)
            }
            !isEnrolled && fetchEnrolledDetails()
        }
    }, [courseId, currentUser?._id])
    
    return {isEnrolled, enrolledDate}
}

export default useCheckEnrolled