import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PublishedCourse, SubNavbar } from '../../components'
import { instructorSubNavLinks } from '../../utils'
import './UploadedCourse.scss'
import { axiosPublic } from '../../api/apiMethod'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import toast from 'react-hot-toast'

const UploadedCourse = () => {
  useDocumentTitle(`Published courses - Webdev Skool`)
  const [publishedCourse, setPublishedCourse] = useState([])
  const {currentUser} = useSelector(state => state.auth)

  useEffect(() => {
    const fetchPublishedCourses = async () => {
      try {
        const {data} = await axiosPublic.get(`/course/publishedCoursesByInstructor/${currentUser?._id}`, {withCredentials: true})
        setPublishedCourse(data?.courses)
      } catch (error) {
        toast.error('Something went wrong')
      }
    }
    fetchPublishedCourses()
  }, [currentUser])

  return (
    <div>
      <SubNavbar title='Instructor Dashboard' links={instructorSubNavLinks} />

      <div className="wrapper">
        <section>
          {publishedCourse?.length > 0 ?
            <>
              <h2 className='course-section__heading'>Published Courses({publishedCourse?.length})</h2>
              <PublishedCourse courses={publishedCourse} />
            </>
            : <h1 className='empty-content'>No Published Courses</h1>
          }
        </section>
      </div>
    </div>
  )
}

export default UploadedCourse