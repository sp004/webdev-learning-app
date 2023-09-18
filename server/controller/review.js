import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import asyncHandler from "express-async-handler";
import Review from "../model/Review.js";
import User from "../model/User.js";

// post new review
export const postReview = asyncHandler(async(req, res, next) => {
    const {id} = req.user 
    const {courseId} = req.params
    const {review, rating} = req.body

    const duplicateUser = await Review.findOne({userId: id, courseId})
    if(duplicateUser) return next(ErrorHandler(209, "You've already posted a review, please refresh the page and edit that"))

    if(!review || !rating) return next(ErrorHandler(400, 'Please enter your review'))

    const newReview = await Review.create({
        ...req.body,
        courseId,
        userId: id,
        reviewDate: Date.now()
    })
    if(!newReview) return(next(ErrorHandler(404, 'Please enter a valid review')))

    res.status(201).json({data: newReview, message: 'Review created successfully', status: 'Success'})
})

// get all reviews
export const getCourseReviews = asyncHandler(async(req, res, next) => {
    const reviews = await Review.find({courseId: req.params?.courseId}).populate('userId', 'fullName avatar')
    if(!reviews) return next(ErrorHandler(404, "No reviews yet..."))
    const reviewWithParsedRating = reviews?.map(r => {
        return {
            ...r._doc, 
            rating: parseFloat(r.rating.toString())
        }
    })
    res.status(200).json({data: reviewWithParsedRating})
})

// get a user's review
export const getReview = asyncHandler(async(req, res, next) => {
    const {id} = req.user
    const userReview = await Review.findOne({userId: id, courseId: req.params.courseId}).exec()
    if(!userReview) return next(ErrorHandler(404, "No review found"))
    res.status(200).json({status: 'Success', data: userReview})
})

// update review
export const editReview = asyncHandler(async(req, res, next) => {
    const updatedReview = await Review.findByIdAndUpdate(req.params?.reviewId, 
        {$set: req.body}, 
        {new: true}
    )
    if(!updatedReview) return next(ErrorHandler(404, "No updated review found"))
    res.status(200).json({status: 'Success', data: updatedReview})
})

// delete review
export const deleteReview = asyncHandler(async(req, res, next) => {
    const deletedReview = await Review.findByIdAndDelete(req.params?.reviewId)
    if(!deletedReview) return next(ErrorHandler(404, "Review not found"))
    res.status(200).json({status: 'Success', message: 'Review deleted successfully'})
})
