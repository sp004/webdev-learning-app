import express from 'express';
import { publishedCoursesByInstructor, createCourse, getCourse, recentUploads, bestSellingCourses, pendingCoursesByInstructor, getCoursesForSuggestions, getSearchedCourses } from '../controller/course.js';
import { verifyInstructor, verifyJWT } from '../middlewares/verifyToken.js';
const courseRouter = express.Router()

courseRouter.get('/courses', getCoursesForSuggestions)
courseRouter.get('/recentUploads/:userId', recentUploads)
courseRouter.get('/bestSellingCourses/:userId', bestSellingCourses)
courseRouter.get('/search', getSearchedCourses)

courseRouter.get('/:courseId', getCourse)

courseRouter.get('/publishedCoursesByInstructor/:instructorId', verifyJWT, verifyInstructor, publishedCoursesByInstructor)
courseRouter.get('/pendingCoursesByInstructor/:instructorId', verifyJWT, verifyInstructor, pendingCoursesByInstructor)
courseRouter.post('/create', verifyJWT, verifyInstructor, createCourse)

export default courseRouter