import express from 'express';
import { checkout, getRazorPayKey, paymentVerification, refund } from '../controller/payment.js';
import { verifyJWT } from '../middlewares/verifyToken.js';
const checkoutRouter = express.Router()

//buy course
checkoutRouter.post('/checkout', verifyJWT, checkout)

//verify payment and save reference to db
checkoutRouter.post('/verification', verifyJWT, paymentVerification)

//refund payment
checkoutRouter.post('/refund', verifyJWT, refund)

checkoutRouter.get('/getKey', verifyJWT, getRazorPayKey)

export default checkoutRouter