import { instance } from "../server.js";
import asyncHandler from "express-async-handler";
import Payment from "../model/Payment.js";
import crypto from "crypto";
import Order from "../model/Order.js";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import EnrolledCourse from "../model/EnrolledCourse.js";
import Review from "../model/Review.js";

// create an order instance
export const checkout = asyncHandler(async (req, res, next) => {
  const {amount} = req.body
  var options = {
    amount: Number(amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);
  res.status(200).json({ success: true, order });
})

//create an order and payment verifiation details in db
export const paymentVerification = asyncHandler(async (req, res, next) => {
  const {courses} = req.body
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  //create payment of successful payment verification
  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    //create order
    const order = await Promise.all(courses.map(course => Order.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      courseId: course?._id,
      userId: req.user?.id,
      purchasedDate: new Date(Date.now()),
      refundAvailableTill: new Date(Date.now() + 86400000),
    })))

    if(!order) return next(ErrorHandler(400, 'Order not placed, please try again later'))

    const enrolledCourses = await Promise.all(courses?.map(async (course) => await EnrolledCourse.create({
      userId: req.user.id,
      courseId: course._id,
    })));
    res.status(201).json({ status: 'Success', paymentId: razorpay_payment_id, courses });
  } else {
    res.status(500).json({ status: 'error', message: 'Payment failed!!! Please try again later' });
  }
});

export const getRazorPayKey = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, key: process.env.RAZORPAY_API_KEY });
})

export const refund = asyncHandler(async (req, res, next) => {
  const {paymentId, amount} = req.body

  // const razorpayResponse = await instance.payments.refund({paymentId, amount});

  // const order = await Order.findOne({paymentId})
  // if(!order) return next(ErrorHandler(400, 'No order found for this payment Id'));
  // order.status = 'Refunded';
  // await order.save();
  // res.send('Successfully refunded')

  const refundResponse = await instance.payments.refund(paymentId, {
    amount: amount*100,
    speed: 'normal',
  });

  if(!refundResponse) return next(ErrorHandler(400, 'Something went wrong, Please try again later'));

  //update order status 'enrolled' to 'refunded
  const order = await Order.findOne({paymentId})
  if(!order) return next(ErrorHandler(400, 'No order found for this payment Id'));
  order.status = 'Refunded';
  await order.save();

  //remove the course from reviews document
  await Review.findOneAndDelete({userId: order?.userId, courseId: order?.courseId})
  
  //remove the course from enrolledCourses document
  await EnrolledCourse.findOneAndDelete({userId: order?.userId, courseId: order?.courseId})
  
  res.status(200).json({data: refundResponse, message: 'Successfully refunded', status: 'Success'});
})