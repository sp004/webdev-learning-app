import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchCartCourses, removeFromCart } from '../../features/cart/cartSlice'
import './PaymentSuccessful.scss'
import { removeWishlist } from '../../features/wishlist/wishlistSlice'
import { axiosPrivate } from '../../api/apiMethod'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const PaymentSuccessful = () => {
  useDocumentTitle(`Payment Successful - Webdev Skool`)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {courses: wishListCourses} = useSelector(state => state.wishlist)
  const {state} = useLocation()

  useEffect(() => {
    //if there is no purchased course, user will be redirected to cart
    if(!state?.length){
      navigate('/cart', {replace: true})
      return
    } 

    //remove purchased course from cart
    if(state?.length === 1){
      dispatch(removeFromCart(state[0]?._id))
    }else{
      const removeAllFromCart = async () => {
        const {data} = await axiosPrivate.delete('/cart/clear')
      }
      removeAllFromCart()
    }
    dispatch(fetchCartCourses())
    
    //remove purchased course from wishlist
    const enrolledCoursesInWishlist = state?.filter(ec => wishListCourses?.some(wc => wc._id === ec._id))

    if(enrolledCoursesInWishlist?.length){
      Promise.all(enrolledCoursesInWishlist?.map(course => dispatch(removeWishlist(course?._id))))
    }
  }, [state, dispatch, navigate, wishListCourses])
  
  return (
    <>
      <section className='payment-success'>
        <h1>Payment Successful</h1>
        <h2>Congrats!!! You are enrolled to the below {state.length < 2 ? 'course' : 'courses'}</h2>
        <Link to='/account/purchase-history' className='button-cart' style={{width: '200px'}}>Go To Purchase History</Link>
        {state?.length === 1 && <p>You can initiate refund from Purchase History</p>}

        <div className='purchased-courses'>
          {state?.map((course, i) => (
            <div key={i} className='purchased-course'>
              <img src={course?.thumbnail} alt={course?.title} />
              <h4>{course?.title}</h4>
              <span style={{fontSize: '12px'}}>By {course?.createdBy?.fullName}</span>
              <Link to={`/course/${course?._id}`} className='button-cart' style={{textAlign: 'center'}}>Visit Course</Link>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default PaymentSuccessful

