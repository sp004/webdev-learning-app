import express from 'express';
import { verifyJWT } from '../middlewares/verifyToken.js';
import { getAllOrders, getUserOrder } from '../controller/order.js';
const orderRouter = express.Router()

orderRouter.get('/all', verifyJWT, getAllOrders)
orderRouter.get('/userOrder', verifyJWT, getUserOrder)

export default orderRouter