import React from 'react'
import './PublishedCourse.scss'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Rating from 'react-rating'
import { BsStar, BsStarFill } from 'react-icons/bs'

const PublishedCourse = ({courses}) => {

  return (
    <div className='published_course--container'>
      {courses?.map((courseItem, index) => (
          <Link key={index} to={`/course/${courseItem?._id}`} className="published_course--card">
              <div className='published_course--card-left'>
                <div className="published_course--thumbnail">
                  <img src={courseItem?.thumbnail} alt={courseItem?.title} />
                </div>
              </div>

              <div className='published_course--card-center'>
                <div className='published_course--info'>
                  <h3>{courseItem?.title}</h3>
                  <p className='published_course--description'>{courseItem?.description}</p>
                  <div className="additional_lecture--info">
                    <p className='published_course--price'>₹{courseItem?.price}</p>
                    <span>•</span>
                    <span>{moment(courseItem?.uploadedOn).format("MM/YYYY")}</span>
                    
                    {courseItem?.avgRating !== 0 && 
                    <div className="published_course--rating star-icon">
                      {(courseItem?.avgRating >= 4.5 && courseItem?.reviewCount > 1) && 
                      <div className='course-tag' style={{width: 'fit-content'}}>
                          <b style={{color: '#555'}}>Bestseller</b>
                      </div>}
                      <h4>{courseItem?.avgRating.toFixed(1)}</h4>
                      <Rating
                        emptySymbol={<BsStar className="star-icon" size={11} />}
                        fullSymbol={<BsStarFill className="star-icon" size={11} />}
                        fractions={2}
                        initialRating={courseItem?.avgRating}
                        readonly
                      />
                      {courseItem?.reviewCount !== 0 && <span>({courseItem?.reviewCount})</span>}
                    </div>}

                  </div>
                  <div className="additional_lecture--lower">
                    <p>{courseItem?.category?.charAt(0).toUpperCase() + courseItem?.category?.slice(1)}</p>
                    <span>•</span>
                    <p>{courseItem?.level?.charAt(0)?.toUpperCase() + courseItem?.level?.slice(1)}</p>
                  </div>
                </div>
              </div>

              <div className='published_course--card-right'>
                <div className="course-stat">
                  <div className="course-stat--data">
                    <p>
                      Total Purchased <strong>{courseItem?.totalEnrolled}</strong>
                    </p>
                  </div>
                  <div className="stat-data">
                    <p> 
                      Refund <strong>{courseItem?.totalRefund}</strong>
                    </p>
                  </div>
                  <div className="stat-data">
                    <p>
                      Total Earning <strong>Rs. {courseItem?.totalEnrolled ? courseItem?.price * courseItem?.totalEnrolled : 0}</strong>
                    </p>
                  </div>
                </div>
              </div>
          </Link>
      ))}
    </div>
  )
}

export default PublishedCourse