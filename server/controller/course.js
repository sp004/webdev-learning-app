import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import Course from "../model/Course.js";
import Instructor from "../model/Instructor.js";
import { checkEnrolled } from "../helpers/checkEnrolled.js";
import { getCoursesAvgRating } from "../helpers/getCourseRating.js";
import Order from "../model/Order.js";
import { calculateEnrollmentStat } from "../utils/calculateEnrollmentStat.js";

//create new Course
export const createCourse = asyncHandler(async(req, res, next) => {
    const newCourse = await Course.create(req.body)
    const instructor = await Instructor.findOne({userId: req.user.id})
    newCourse.createdBy = instructor.userId
    await newCourse.save(newCourse)

    res.status(201).json({message: 'Course has been created', newCourse})
})

//get a particular Course
export const getCourse = asyncHandler(async(req, res, next) => {
    const {courseId} = req.params

    const course = await Course.findById(courseId).populate('createdBy', 'fullName avatar email')
    if(!course) return next(ErrorHandler(404, 'No course found!!!'))

    // Fetch the instructor information using the user ID
    const instructor = await Instructor.findOne({ userId: course?.createdBy?._id?.toString() }).select("designation bio").exec();


    // if(req?.user?.id){
        res.status(200).json({course: {
            ...course._doc,
            createdBy: {
                ...course._doc?.createdBy._doc,
                bio: instructor?.bio,
                designation: instructor?.designation,
                instructorId: instructor?._id
            } 
        }})
    // }
    // else{
    //     const coursesInCart = await Cart.find({courseId: course.id, userId: req?.user?.id})
    // }
})

//get courses based on search
export const getSearchedCourses = asyncHandler(async(req, res, next) => {
    const {query, rating, level, category} = req.query

    if(query && query?.trim() === ''){
        return next(ErrorHandler(400, 'Invalid query'))
    }
    if(rating && (parseInt(rating) < 0 || parseInt(rating) > 5)){
        return next(ErrorHandler(400, 'Invalid rating'))
    }
    if(level && !['beginner', 'intermediate', 'advanced', 'all'].includes(level)){
        return next(ErrorHandler(400, 'Invalid level'))
    }
    if(category && !['fullstack', 'frontend', 'backend'].includes(category)){
        return next(ErrorHandler(400, 'Invalid category'))
    }
    const filterArray = [
        {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
          ]
        },
        { approved: 'yes' }
      ];
      
      if (req.query?.level) {
        filterArray.push({ level: req.query.level });
      }
      
      if (req.query?.category) {
        filterArray.push({ category: req.query.category });
      }
  
    const searchedCourses = await Course.find({
        $and: [
            {
              $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
              ]
            },
            { approved: 'yes' },
            req.query?.level ? { level }: {},
            req.query?.category ? { category } : {}
        ]
    }).where({approved: 'yes'}).populate('createdBy', 'fullName')
    
    if(!searchedCourses) return next(ErrorHandler(404, 'No course found!!!'))
    
    let coursesWithRating = await getCoursesAvgRating(searchedCourses)
    coursesWithRating = coursesWithRating?.map(c => {
        return {
            ...c._doc,
            avgRating: c?.avgRating
        }
    })

    if(req.query?.rating){
        coursesWithRating = coursesWithRating?.filter(item => item?.avgRating >= parseInt(rating))
    }
    
    res.status(200).json({course: coursesWithRating, success: true})
})

//get courses based on filter
export const getCoursesByFilter = asyncHandler(async(req, res, next) => {
    const {query, rating, level, category} = req.query

    if(!query || query?.trim() === ''){
        return next(ErrorHandler(400, 'Invalid query'))
    }
    if(!rating && (parseInt(rating) < 0 || parseInt(rating) > 5)){
        return next(ErrorHandler(400, 'Invalid rating'))
    }

    const searchedCourses = await Course.find({
        $and: [
            {
              $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
              ]
            },
            { approved: 'yes' },
            { level: req.query?.level },
            { category: req.query?.category }
        ]
    }).where({approved: 'yes'}).populate('createdBy', 'fullName')

    // const regexQuery = new RegExp(title, 'i');
    const filteredCourses = await Course.find({level: req.query?.level}).where({approved: 'yes'}).populate('createdBy', 'fullName')

    if(!filteredCourses) return next(ErrorHandler(404, 'No course found!!!'))
    
    res.status(200).json({course: filteredCourses, success: true})
})

//get all Courses
export const getCoursesForSuggestions = asyncHandler(async(req, res, next) => {
    const {keyword} = req.query
    let query;

    if (keyword && keyword.trim() !== '') {
        query = {
            $or: [
                { title: { $regex: keyword, $options: 'i' } }, // Case-insensitive search in title
                { description: { $regex: keyword, $options: 'i' } }, // Case-insensitive search in description
            ],
        };
    }
    const suggestedCourses = await Course.find(query).where({approved: 'yes'}).populate("createdBy", "fullName").limit(4)

    res.status(200).json({data: suggestedCourses})
})


//get all approved Courses by instructor
export const publishedCoursesByInstructor = asyncHandler(async(req, res, next) => {
    const {instructorId} = req.params
    
    const courses = await Course.find({createdBy: instructorId}).where({approved: 'yes'}).populate({
        path: "_id"
        // model: "Order",
        // populate: {
        //     select: 'status'
        // }
    })
    if(!courses) return next(ErrorHandler(404, 'No Course found'))
    
    const orderData = await (await Promise.all(courses?.map(course => Order.find({courseId: course._id})))).flat(1)
    const enrollmentData = calculateEnrollmentStat(orderData)

    const coursesWithEnrollementData = courses?.map(course => {
        const filtered = enrollmentData.find((item) => item.courseId.equals(course._id))
        return {
            ...course._doc,
            totalEnrolled: filtered?.totalEnrolled,
            totalRefund: filtered?.totalRefund
        }
    })

    const coursesWithRating = await getCoursesAvgRating(coursesWithEnrollementData)
    const updatedPublishedCourses = coursesWithRating?.map(course => {
        return {
            avgRating: course.avgRating,
            reviewCount: course.reviewCount,
            ...course,
        }
    })

    res.status(200).json({courses: updatedPublishedCourses})
})

//get all unapprovd/pending Courses by instructor
export const pendingCoursesByInstructor = asyncHandler(async(req, res, next) => {
    const {instructorId} = req.params

    const courses = await Course.find({createdBy: instructorId}).where({approved: 'no'})
    if(!courses) return next(ErrorHandler(404, 'No Course found'))

    res.status(200).json({courses})
})


//get courses which avg rating is greater than 4.5: Best seller
export const bestSellingCourses = asyncHandler(async(req, res, next) => {
    const {userId} = req.params
    const allCourses = await Course.find().populate('createdBy', 'fullName')

    if(userId !== 'undefined'){
        const enrolledtopRatedCourses = await checkEnrolled(allCourses, userId)
        const coursesWithRating = await getCoursesAvgRating(enrolledtopRatedCourses)

        const sortedBestSellingCourses = coursesWithRating?.filter((course) => course.avgRating > 4.5 && course.reviewCount > 1)
    
        if(!sortedBestSellingCourses?.length) return next(ErrorHandler(404, 'There are no best seller courses'))
        res.status(200).json({data: sortedBestSellingCourses})
    }else{
        const coursesWithRating = await getCoursesAvgRating(allCourses)

        const sortedBestSellingCourses = coursesWithRating?.map(item => {
            return {
                avgRating: item.avgRating,
                reviewCount: item.reviewCount,
                ...item._doc,
            }
        })?.filter((course) => course.avgRating > 4.5 && course.reviewCount > 1)
    
        if(!sortedBestSellingCourses?.length) return next(ErrorHandler(404, 'There are no best seller courses'))
        res.status(200).json({data: sortedBestSellingCourses})
    }
})


//get courses which are uploaded recently
export const recentUploads = asyncHandler(async(req, res, next) => {
    const {userId} = req.params
    const recentCourses = await Course.find().sort({uploadedOn: -1}).populate('createdBy', 'fullName').where({approved: 'yes'}).limit(5)
    
    if(req?.params?.userId !== "undefined"){
        const enrolledRecentUploads = await checkEnrolled(recentCourses, userId)
        const coursesWithRating = await getCoursesAvgRating(enrolledRecentUploads)
        if(!coursesWithRating?.length) return next(ErrorHandler(404, 'No courses have been uploaded yet'))
        res.status(200).json({data: coursesWithRating})
    }else{
        const coursesWithRating = await getCoursesAvgRating(recentCourses)
        if(!coursesWithRating?.length) return next(ErrorHandler(404, 'No courses have been uploaded yet'))
        const updatedRecentCourses = coursesWithRating?.map(course => {
            return {
                avgRating: course.avgRating,
                reviewCount: course.reviewCount,
                ...course._doc,
            }
        })
        res.status(200).json({data: updatedRecentCourses})
    }
})


//get courses by category
export const courseByCategory = asyncHandler(async(req, res, next) => {

})





//delete rejected course within 1 day
// export const removeRejectedCourse = asyncHandler(async(req, res, next) => {
//     const course = await Course.find({approved: 'rejected'})
// })