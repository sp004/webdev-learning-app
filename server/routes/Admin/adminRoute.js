import express from 'express';
const adminRouter = express.Router()

adminRouter.get('/allCourses')
adminRouter.put('/approve/:courseId')
adminRouter.put('/reject/:courseId')

export default adminRouter