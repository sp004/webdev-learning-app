import React, { useEffect, useState } from 'react'
import { CourseSection, Header } from '../../components'
import { axiosPublic } from '../../api/apiMethod'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { getWishlistCourses } from '../../features/wishlist/wishlistSlice'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import './Home.scss'

const Home = () => {
  useDocumentTitle(`Home - Webdev Skool`)
  const [recentCourses, setRecentCourses] = useState([])
  const [bestSellingCourses, setBestSellingCourses] = useState([])
  const {currentUser} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchBestSellingCourses = async () => {
      // if(currentUser?._id){
        try {
          const {data} = await axiosPublic.get(`/course/bestSellingCourses/${currentUser?._id}`, {withCredentials: true})
          setBestSellingCourses(data?.data?.sort((a, b) => b.avgRating - a.avgRating))
        } catch (error) {
          toast.error('Something went wrong')
        }
      // }
    }
    fetchBestSellingCourses()
  }, [currentUser?._id])

  useEffect(() => {
    const fetchRecentUploads = async () => {
      // if(currentUser?._id){
        try {
          const {data} = await axiosPublic.get(`/course/recentUploads/${currentUser?._id}`, {withCredentials: true})
          setRecentCourses(data?.data)
        } catch (error) {
          toast.error('Something went wrong')
        }
      // }
    }
    fetchRecentUploads()
  }, [currentUser?._id])

  useEffect(() => {
    currentUser?._id && dispatch(getWishlistCourses())
  }, [dispatch, currentUser?._id])
  
  return (
    <>
      <Header />

      <div className='wrapper'>
        <CourseSection heading='Top Rated Courses' courses={bestSellingCourses}  />
        <CourseSection heading='Latest Uploads' courses={recentCourses} />
      </div>
    </>
  )
}

export default Home