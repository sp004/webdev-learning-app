import express from 'express';
import { verifyJWT } from '../middlewares/verifyToken.js';
import { enrollmentDate, enrollmentCount, fetchEnrolledCourses } from '../controller/enrolledCourse.js';
const enrolledCourseRouter = express.Router()

enrolledCourseRouter.get('/courses', verifyJWT, fetchEnrolledCourses)
enrolledCourseRouter.get('/enrolledOn/:courseId', verifyJWT, enrollmentDate)
enrolledCourseRouter.get('/enrollmentCount/:courseId', enrollmentCount)

export default enrolledCourseRouter