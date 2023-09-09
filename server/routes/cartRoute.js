import express from 'express';
import { clearUserCart, getCartData, insertCart, removeCourseFromCart } from '../controller/cart.js';
import { verifyJWT } from '../middlewares/verifyToken.js';
const cartRouter = express.Router()

cartRouter.get('/getCart', verifyJWT, getCartData)
cartRouter.post('/add/:courseId', verifyJWT, insertCart)
cartRouter.delete('/remove/:courseId', verifyJWT, removeCourseFromCart)
cartRouter.delete('/clear', verifyJWT, clearUserCart)


export default cartRouter