import express from 'express';
import { verifyJWT } from '../middlewares/verifyToken.js';
import { getAllOrders, getUserOrder } from '../controller/order.js';
const orderRouter = express.Router()

orderRouter.get('/all', verifyJWT, getAllOrders)
orderRouter.get('/userOrder', verifyJWT, getUserOrder)
// orderRouter.get('/courseOrderStat', verifyJWT, courseOrderStat)

export default orderRouter