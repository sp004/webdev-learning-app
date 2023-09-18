import React, { useEffect, useState } from 'react'
import './ApprovalPending.scss'
import { PendingApproval, SubNavbar } from '../../components'
import { instructorSubNavLinks } from '../../utils'
import { useSelector } from 'react-redux'
import { axiosPublic } from '../../api/apiMethod'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import toast from 'react-hot-toast'

const ApprovalPending = () => {
  useDocumentTitle(`Pending for Approval - Webdev Skool`)
    const [PendingCourses, setPendingCourses] = useState([])
    const {currentUser} = useSelector(state => state.auth)

    useEffect(() => {
        const fetchPendingCourses = async () => {
          try {
            const {data} = await axiosPublic.get(`/course/pendingCoursesByInstructor/${currentUser?._id}`)
            setPendingCourses(data?.courses)
          } catch (error) {
            toast.error('Something went wrong')
            // console.error(error?.message)
          }
        }
        fetchPendingCourses()
    }, [currentUser])

  return (
    <div>
        <SubNavbar title='Instructor Dashboard' links={instructorSubNavLinks} />

        <div className='wrapper'>
          <section>
            {PendingCourses?.length > 0 
            ?
              <div className='course-card--container'>
                {PendingCourses?.map(course => (
                  <PendingApproval key={course?._id} courseItem={course} />
                ))}
              </div>
            :
              <h1 className='empty-content'>No courses are pending for approval</h1>
            }
          </section>
        </div>
    </div>
  )
}

export default ApprovalPending