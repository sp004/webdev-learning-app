import express from 'express';
import { allCoursesByInstructor, editInstructor, getInstructor, getInstructorStats, onboardInstructor } from '../controller/instructor.js';
import { verifyInstructor, verifyJWT } from '../middlewares/verifyToken.js';
const InstructorRouter = express.Router()

InstructorRouter.post('/onboard', verifyJWT, onboardInstructor)
InstructorRouter.get('/profile/:userId', getInstructor)
InstructorRouter.get('/courses/:userId/:loggedinUserId', allCoursesByInstructor)
InstructorRouter.patch('/edit', verifyInstructor, editInstructor)
InstructorRouter.get('/stats/:userId', getInstructorStats)

export default InstructorRouter