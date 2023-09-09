import express from 'express';
import { verifyJWT } from '../middlewares/verifyToken.js';
import { getReview, getCourseReviews, postReview, editReview, deleteReview } from '../controller/review.js';
const reviewRouter = express.Router()

reviewRouter.post('/post/:courseId', verifyJWT, postReview)
reviewRouter.get('/allReviews/:courseId', getCourseReviews)
reviewRouter.get('/:courseId', verifyJWT, getReview)
reviewRouter.put('/edit/:reviewId', verifyJWT, editReview)
reviewRouter.delete('/delete/:reviewId', verifyJWT, deleteReview)

export default reviewRouter