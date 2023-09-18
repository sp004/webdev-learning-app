import React from 'react'
import './Feedback.scss'
import { BsStar, BsStarFill } from 'react-icons/bs'
import Rating from 'react-rating'

const Feedback = ({avgRating, ratingsByCount, totalReviewer}) => {

  return (
    <div className='course_feedback'>
      <h2>Student feedback</h2>
      <div className='course_feedback--wrapper'>
        <div className='course_feedback--left'>
          <h2 className="course_feedback--left-rating">{avgRating}</h2>
          <Rating
            fullSymbol={<BsStarFill className="star-icon" size={15} />}
            emptySymbol={<BsStar className="star-icon" size={15} />}
            initialRating={avgRating}
            readonly
          />
          <p>Course Rating</p>
        </div>
        <div className='course_feedback--right'>
          {ratingsByCount?.map((item, i) => (
            <div className='course_feedback--right-container' key={i}>
              <div className='course_feedback--percentline'>
                <div className='course_feedback--percentline-container'>
                  <div className='course_feedback--lightbg'>
                    <div className='course_feedback--darkbg' style={{width: `${Math.floor((item?.count / totalReviewer) * 100)}%`}}></div>
                  </div>
                </div>
              </div>
              <Rating
                fullSymbol={<BsStarFill className="star-icon" size={15} />}
                emptySymbol={<BsStar className="star-icon" size={15} />}
                initialRating={item.star}
                readonly
                className='course_feedback--star-icon'
              />
              <p className='course_feedback--percent'>{Math.floor((item?.count / totalReviewer) * 100)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feedback