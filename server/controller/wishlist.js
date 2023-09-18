import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import Wishlist from "../model/Wishlist.js";
import { getCoursesAvgRating } from "../helpers/getCourseRating.js";

export const addToWishlist = asyncHandler(async(req, res, next) => {
    const {courseId} = req.params

    //check if the course is already in wishlist
    const course = await Wishlist.findOne({courseId, userId: req.user.id}).exec()
    if(course) return next(ErrorHandler(209, 'Course already added to wishlist'))

    await Wishlist.create({ courseId, userId: req.user.id })
    res.status(201).json({message: 'Course added in the wishlist', status: 'Success'})
})

//get wishlist of an user
export const getWishlistCourses = asyncHandler(async(req, res, next) => {
    const courses = await Wishlist.find({userId: req.user.id})
                    .populate({
                        path: "courseId",
                        populate: {
                            path: "createdBy",
                            model: "User",
                            select: 'fullName'
                        }
                    })
                    .select("-_id -userId")
                    
    if(!courses?.length) return next(ErrorHandler(404, "No courses found in wishlist"));
    const wishlistCoursesWithRating = await getCoursesAvgRating(courses?.map(c => c?.courseId))
    let wishlistCourses = wishlistCoursesWithRating.map(c => {
        return {
            ...c._doc,
            avgRating: c?.avgRating,
            reviewCount: c?.reviewCount
        }
    })
    res.status(200).json({data: wishlistCourses})
})

//remove course wishlist
export const removeFromWishlist = asyncHandler(async(req, res, next) => {
    const course = await Wishlist.findOne({courseId: req.params.courseId, userId: req.user.id}).exec()
    if(!course) return next(ErrorHandler(404, 'Course not found in wishlist'))

    await course.delete()
    res.status(200).json({message: 'Course is removed from wishlist', status: 'Success'})
})
