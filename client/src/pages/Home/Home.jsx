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
  const [isTopRatedLoading, setIsTopRatedLoading] = useState(false)
  const [isLatestLoading, setIsLatestLoading] = useState(false)
  const [recentCourses, setRecentCourses] = useState([])
  const [bestSellingCourses, setBestSellingCourses] = useState([])
  const {currentUser} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchBestSellingCourses = async () => {
      // if(currentUser?._id){
        setIsTopRatedLoading(true)
        try {
          const {data} = await axiosPublic.get(`/course/bestSellingCourses/${currentUser?._id}`)
          setBestSellingCourses(data?.data?.sort((a, b) => b.avgRating - a.avgRating))
        } catch (error) {
          toast.error('Something went wrong')
        }
        setIsTopRatedLoading(false)
      // }
    }
    fetchBestSellingCourses()
  }, [currentUser?._id])

  useEffect(() => {
    const fetchRecentUploads = async () => {
      // if(currentUser?._id){
        setIsLatestLoading(true)
        try {
          const {data} = await axiosPublic.get(`/course/recentUploads/${currentUser?._id}`)
          setRecentCourses(data?.data)
        } catch (error) {
          toast.error('Something went wrong')
        }
        setIsLatestLoading(false)
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
        <CourseSection heading='Top Rated Courses' courses={bestSellingCourses} loading={isTopRatedLoading}  />
        <CourseSection heading='Latest Uploads' courses={recentCourses} loading={isLatestLoading} />
      </div>
    </>
  )
}

export default Home