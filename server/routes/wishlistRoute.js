import express from 'express';
import { addToWishlist, getWishlistCourses, removeFromWishlist } from '../controller/wishlist.js';
import { verifyJWT } from '../middlewares/verifyToken.js';

const wishlistRouter = express.Router()

wishlistRouter.post('/add/:courseId', verifyJWT, addToWishlist)
wishlistRouter.get('/getWishlistCourses', verifyJWT, getWishlistCourses)
wishlistRouter.delete('/remove/:courseId', verifyJWT, removeFromWishlist)

export default wishlistRouter