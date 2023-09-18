import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { fetchCartCourses, removeFromCart } from '../../features/cart/cartSlice'
import './Cart.scss'
import { addToWishlist } from '../../features/wishlist/wishlistSlice'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const Cart = () => {
    useDocumentTitle(`Cart - Webdev Skool`)

    const {courses, totalPrice} = useSelector(state => state.cart)
    // const {currentUser} = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const removeCartHandler = async (courseId) => {
        await dispatch(removeFromCart(courseId))
        await dispatch(fetchCartCourses())
    }
    
    const moveToWishlistHandler = async (courseId) => {
        await dispatch(removeFromCart(courseId))
        await dispatch(fetchCartCourses())
        await dispatch(addToWishlist(courseId))
    }

    const checkoutHandler = (courses) => {
        navigate('/checkout', {state: courses})
    }

  return (
    <>
        <section className='cart-container'>
            {courses?.length > 0 ? 
            <>
                <h1 className='page-heading'>Course Cart</h1>
                <h4 className='cart-item_number'>{courses?.length} {courses?.length > 1 ? "Courses" : "Course"} in Cart</h4>
                {courses?.length > 1 && 
                <span className='input-error'>
                    *As of now, refund is disabled if more than 1 course are purchased from cart. To get refund, you've to go with <strong>Buy Now </strong>option for each course.
                </span>}
                <hr />

                <div className='cart-wrapper space-bw'>
                    {/* left side  */}
                    <div className='cart-content'>
                        {courses?.map(course => (
                            <div key={course?._id}>
                                <div className='cart-item space-bw'>
                                    <Link to={`/course/${course?._id}`} className='cart-item_left'>
                                        <div className='cart-item_thumbnail'>
                                            <img src={course?.thumbnail} alt={course?.title} />
                                        </div>
                                        <div className='cart-item_info'>
                                            <h3 className='cart-item_title'>{course?.title}</h3>
                                            <p className='cart-item_instructor'>By {course?.createdBy?.fullName}</p>
                                        </div>
                                    </Link>
                                    <div className='cart-item_actions --flex-center-col'>
                                        <h2>₹{course?.price}</h2>
                                        <p onClick={() => removeCartHandler(course?._id)}>Remove</p>
                                        <p onClick={() => moveToWishlistHandler(course?._id)}>Move to Wishlist</p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                    {/* right side  */}
                    <div className='cart-checkout'>
                        <h5>Total:</h5>
                        <h1><span style={{fontFamily: 'sans-sarif', fontSize: 'inherit'}}>₹</span>{totalPrice}</h1>
                        <button onClick={() => checkoutHandler(courses)} className='button-cart'>Checkout</button>
                    </div>
                </div>
            </> : 
            <>
                <h1 className='empty-content'>No Course in the Cart</h1>
            </>
            }
        </section>
    </>
  )
}

export default Cart