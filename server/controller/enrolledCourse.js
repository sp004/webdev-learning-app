import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import EnrolledCourse from "../model/EnrolledCourse.js";
import Review from "../model/Review.js";

export const fetchEnrolledCourses = asyncHandler(async(req, res, next) => {
  const page = Number(req.query?.page)
  // console.log("💥🤍", page)
  const perPage = 4; 
  // Calculate the number of items to skip based on the page number and perPage
  // const skip = (page - 1) * perPage;
  const totalCourses = await EnrolledCourse.countDocuments({userId: req.user.id})
  const enrolledCourses = await EnrolledCourse.find({userId: req.user.id}).skip(page * perPage - perPage).limit(perPage).populate({
    path: "courseId",
    populate: {
      path: "createdBy",
      model: "User",
      select: 'fullName'
    }
  }).select("-_id -userId")

  if(!enrolledCourses?.length) return next(ErrorHandler(404, "No Courses have been enrolled"))
  // if(!enrolledCourses?.length) {
  //   return res.status(204).json({message: 'No Courses have been enrolled'}) 
  // }
  const myReview = await Promise.all(enrolledCourses?.map(course => Review.findOne({courseId: course?.courseId?._id, userId: req.user.id}).select("rating review _id")))
  const coursesWithReview = enrolledCourses.map((course, i) => (
    {
      ...course._doc, 
      myRating: parseFloat(myReview[i]?.rating.toString()), 
      review: myReview[i]?.review, reviewId:myReview[i]?._id
    }))
  // console.log("🧨🎆", {...enrolledCourses, enrolledOn: enrolledCourses.enrolledOn})
  // console.log("🥳👻", coursesWithReview)
  res.status(200).json({courses: coursesWithReview, totalCourses})
})

//get course enrolled date for a particular user, total enrollments count of a course
export const enrollmentDate = asyncHandler(async(req, res, next) => {
  const enrolledDate = await EnrolledCourse.find({courseId: req.params?.courseId, userId: req.user.id}).select('enrolledOn -_id')
  // console.log("🎀🎗", enrolledDate[0])
  if(!enrolledDate) return next(ErrorHandler(404, 'No enrolled courses found'))

  res.status(200).json({data: enrolledDate[0]?.enrolledOn})
})

//get course enrolled date for a particular user, total enrollments count of a course
export const enrollmentCount = asyncHandler(async(req, res, next) => {
  // console.log("🛩🛸", req.params?.courseId)
  const totalEnrollment = await EnrolledCourse.countDocuments({courseId: req.params?.courseId})
  // console.log("🥽🕶", totalEnrollment)
  if(!totalEnrollment){
    return res.status(204).json({data: totalEnrollment})
  } 
  
  res.status(200).json({data: totalEnrollment})
})
