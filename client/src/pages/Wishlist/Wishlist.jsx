import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SubNavbar, CourseCard } from '../../components'
import { myCourseSubNavLinks } from '../../utils'
import { getWishlistCourses } from '../../features/wishlist/wishlistSlice'
import './Wishlist.scss'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const Wishlist = () => {
  useDocumentTitle(`Wishlist - Webdev Skool`)
  const {courses} = useSelector(state => state.wishlist)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getWishlistCourses())
  }, [dispatch])
  
  return (
    <>
      <SubNavbar title='My Learning' links={myCourseSubNavLinks}  />

      <div className='wrapper'>
        <section>
          {courses?.length > 0 
          ?
            <div className='course-card--container'>
              {courses?.map(wishlist => (
                <CourseCard key={wishlist?._id} courseItem={wishlist} />
              ))}
            </div>
          :
            <h1 className='empty-content'>Empty Wishlist!!!</h1>
          }
        </section>
      </div>
    </>
  )
}

export default Wishlist
