import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './CourseCard.scss'
import { BsHeart, BsHeartFill, BsStar, BsStarFill } from 'react-icons/bs'
import { addToWishlist, getWishlistCourses, removeWishlist } from '../../features/wishlist/wishlistSlice'
import { useDispatch, useSelector } from 'react-redux'
import { courseDurationOfCard } from '../../utils/courseDurationFormatter'
import Rating from 'react-rating'
import { toast } from 'react-hot-toast'

const CourseCard = ({courseItem}) => {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { courses: wishlistCourses } = useSelector((state) => state.wishlist);
    const {currentUser} = useSelector(state => state.auth)

    const noOfLectures = courseItem?.courseContent?.length 
    const {hour, minutes} = courseDurationOfCard(courseItem?.courseContent)

  //check if the course is already in the wishlist
    useEffect(() => {
        if (currentUser?._id && wishlistCourses?.filter((item) => item?._id === courseItem?._id)?.length > 0) {
            setIsWishlisted(true);
        } else {
            setIsWishlisted(false);
        }
    }, [wishlistCourses, courseItem, currentUser?._id]);
    
    const wishlistHandler = async (e, action, courseId) => {
        e.stopPropagation()
        if(!currentUser?._id){
            toast.error('Please login')
            return
        }
        if(action === 'remove'){
            await dispatch(removeWishlist(courseId))
        }else{
            await dispatch(addToWishlist(courseId))
        }
        setIsWishlisted(prev => !prev)
        await dispatch(getWishlistCourses())
    };

  return (
    <div className='course-card'>
        <div onClick={() => navigate(`/course/${courseItem?._id}`)}>
            <div className='course-card--thumbnail'>
                <img src={courseItem?.thumbnail} alt={courseItem?.title} />
            </div>

            <div className='course-card--info'>
                <h4>{courseItem?.title}</h4>
                <p>{courseItem?.createdBy?.fullName}</p>

                <span>{noOfLectures} {noOfLectures > 1 ? "Lectures" : "Lecture"} • {hour ? `${hour}hr` : ''} {`${minutes}min`} • {courseItem?.level === 'all' ? 'All Levels' : courseItem?.level}</span>

                {courseItem?.avgRating !== 0 &&
                <span className="course-card--rating star-icon">
                    {(courseItem?.avgRating >= 4.5 && courseItem?.reviewCount > 1) && 
                    <div className='course-tag' style={{width: 'fit-content'}}>
                        <b style={{color: '#555'}}>Bestseller</b>
                    </div>}
                    <h3>{courseItem?.avgRating?.toFixed(1)}</h3>
                    <div>
                        <Rating
                            emptySymbol={<BsStar className="star-icon" size={12} />}
                            fullSymbol={<BsStarFill className="star-icon" size={12} />}
                            fractions={2}
                            initialRating={courseItem?.avgRating}
                            readonly
                        />
                    </div>
                    {courseItem?.reviewCount !== 0 && <p>({courseItem?.reviewCount})</p>}
                </span>}

                {courseItem?.isEnrolled 
                ?
                    <div className='course-card--bottom'>
                        <span className='enrolled-text'>Enrolled</span>
                    </div>
                :
                    <div className='course-card--bottom'>
                        <h4>₹{courseItem?.price}</h4>
                        <div className="course-wishlist">
                            {isWishlisted ? (
                            <BsHeartFill onClick={(e) => wishlistHandler(e, 'remove', courseItem?._id)} />
                            ) : (
                            <BsHeart onClick={(e) => wishlistHandler(e, 'add', courseItem?._id)} />
                            )}
                        </div>
                    </div>
                }
            </div>
        </div>
    </div>
  )
}

export default CourseCard