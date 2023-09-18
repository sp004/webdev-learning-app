import Instructor from "../model/Instructor.js"
import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import User from "../model/User.js";
import Course from "../model/Course.js";
import Review from "../model/Review.js";
import EnrolledCourse from "../model/EnrolledCourse.js";
import { checkEnrolled } from "../helpers/checkEnrolled.js";
import { getCoursesAvgRating } from "../helpers/getCourseRating.js";

export const onboardInstructor = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({_id: req.user.id.toString()}).exec()
    if(!user) return next(ErrorHandler(404, "User not found"))

    //check if the instructor is already onboarded
    const duplicate = await Instructor.findOne({userId: user._id})
    if(duplicate) return next(ErrorHandler(404, "Instructor already onboarded"))

    const instructor = await Instructor.create({
        ...req.body,
        userId: req.user.id
    })

    if(instructor){
        user.isInstructor = true
        await user.save()
    }

    res.status(201).json({status: 'Success', message: `Congrats, ${user.fullName}'s instructor account is created successfully`, instructor})
})

export const getInstructor = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({_id: req.params?.userId.toString()})
    if(!user) return next(ErrorHandler(404, "Instructor not found"))

    if(user?.isInstructor){
        const instructor = await Instructor.findOne({userId: user._id})
        const instructorInfo = {...instructor._doc, fullName: user.fullName, avatar: user.avatar}
        res.status(200).json({instructor: instructorInfo})
    }
})

export const editInstructor = asyncHandler(async(req, res, next) => {
    const {designation, bio} = req.body

    //find user's info by it's id
    const instructor = await Instructor.findOne({userId: req.user.id.toString()}).exec()
    if(!instructor) return next(ErrorHandler(404, 'No user found'))

    instructor.designation = designation || instructor.designation
    instructor.bio = bio || instructor.bio
        
    await instructor.save()
    res.status(200).json({instructor, message: 'Instructor updated successfully'})
})

//get all the stats of an instructor
export const getInstructorStats = asyncHandler(async(req, res, next) => {
    const {userId} = req.params
    const allPublichedCourses = await Course.find({createdBy: userId.toString()}).where({approved: 'yes'}).select('_id')

    const allCollectiveReviews = await (await Promise.all(allPublichedCourses?.map(c => Review.find({courseId: c?._id}).select('rating')))).flat(1)

    const noOfReviews = allCollectiveReviews?.length

    const avgRating = allCollectiveReviews?.map(c => parseFloat(c.rating))
    
    const totalEnrolledStudents = await (await Promise.all(allPublichedCourses?.map(c => EnrolledCourse.countDocuments({courseId: c._id})))).flat(1)

    res.status(200).json({avgRating, noOfReviews, totalEnrolledStudents})
})

//get all courses by an instructor
export const allCoursesByInstructor = asyncHandler(async(req, res, next) => {
    const {userId, loggedinUserId} = req.params
    const courses = await Course.find({createdBy: userId.toString()}).where({approved: 'yes'}).populate('createdBy', 'fullName')

    if(loggedinUserId !== 'undefined'){
        const coursesWithEnrollmentData = await checkEnrolled(courses, loggedinUserId)
        const coursesWithRating = await getCoursesAvgRating(coursesWithEnrollmentData)
        res.status(200).json({courses: coursesWithRating})
    }else{
        const coursesWithRating = await getCoursesAvgRating(courses)
        const modeifiedCourses = coursesWithRating?.map(c => {
            return {
                ...c._doc,
                avgRating: c.avgRating,
                reviewCount: c.reviewCount
            }
        })
        res.status(200).json({courses: modeifiedCourses})
    }
})