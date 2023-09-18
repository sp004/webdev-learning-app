import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { axiosPublic } from '../../../api/apiMethod'
import { AiFillPlayCircle, AiFillStar } from 'react-icons/ai'
import { HiUsers } from 'react-icons/hi'
import { MdReviews } from 'react-icons/md'
import './MeetYourInstructor.scss'
import OtherCourses from '../OtherCourses/OtherCourses'
import { toast } from 'react-hot-toast'

const MeetYourInstructor = ({course}) => {
  const [courses, setCourses] = useState([])
  const [instructorRating, setInstructorRating] = useState(null)
  const [totalReviews, setTotalReviews] = useState(null)
  const [totalEnrolledStudents, setTotalEnrolledStudents] = useState(null)
  
  const {currentUser} = useSelector(state => state.auth)
  const {instructor} = useSelector(state => state.instructor)

  useEffect(() => {
    const fetchInstructorStats = async () => {
      if(course?.createdBy?._id){
        try {
          const {data} = await axiosPublic.get(`/instructor/stats/${course?.createdBy?._id}`)

          setInstructorRating(data?.avgRating?.reduce((acc, cv) => acc + cv, 0))
          setTotalReviews(data?.noOfReviews)
          setTotalEnrolledStudents(data?.totalEnrolledStudents?.reduce((acc, cv) => acc + cv, 0))
        } catch (error) {
          console.error(error?.response.data)
        }
      }
    }
    fetchInstructorStats()
  }, [course?.createdBy?._id])

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      if(course?.createdBy?._id){
        try {
          const {data} = await axiosPublic.get(`/instructor/courses/${course?.createdBy?._id}/${currentUser?._id}`, {withCredentials: true})
          setCourses(data?.courses)
        } catch (error) {
          // console.log(error?.response.data)
          toast.error('Something went wrong')
        }
      }
    }
    fetchPublishedCourses()
  }, [course?.createdBy?._id, currentUser?._id])

  const otherCourses = courses?.filter(c => c?._id !== course?._id)

  return (
    <div id={`${instructor?.fullName?.toLowerCase().split(' ').join('')}`} className='instructor-details'>
        <h2>Meet Your Instructor</h2>

        <div className='instructor-details--container'>
          <div className='instructor-details--top'>
            <h3 className='instructor-details--fullname'>{course?.createdBy?.fullName}</h3>
            <p className='instructor-details--designation'>{course?.createdBy?.designation}</p>
          </div>

          <div className='instructor-details--middle'>
            <div className="avatar">
              <img src={course?.createdBy?.avatar} alt={course?.createdBy?.fullName} />
            </div>
            <div className="allcourses-stats">
              {instructorRating && <div className='allcourses-stats--row'>
                <AiFillStar />
                <p>{(instructorRating/totalReviews).toFixed(1)} Instructor Rating</p>
              </div>}
              {totalReviews > 0 && <div className='allcourses-stats--row'>
                <MdReviews />
                <p>{totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}</p>
              </div>}
              {totalEnrolledStudents > 0 && <div className='allcourses-stats--row'>
                <HiUsers />
                <p>{totalEnrolledStudents} {totalEnrolledStudents === 1 ? "Student" : "Students"}</p>
              </div>}
              <div className='allcourses-stats--row'>
                <AiFillPlayCircle />
                <p>{courses?.length} {courses?.length === 1 ? "Course" : "Courses"}</p>
              </div>
            </div>
          </div>

          <div className="instructor-details--bottom">
            <p className='instructor-details--bio'>{course?.createdBy?.bio}</p>

            {otherCourses?.length !== 0 &&
              <div className="other-courses--container">
                <h2>Other Courses by {course?.createdBy?.fullName}</h2>
                <OtherCourses otherCourses={otherCourses} />
              </div>
            }
          </div>

        </div>
    </div>
  )
}

export default MeetYourInstructor