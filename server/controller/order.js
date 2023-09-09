import asyncHandler from "express-async-handler";
import Order from "../model/Order.js";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";

export const getAllOrders = asyncHandler(async(req, res, next) => {
    const orders = await Order.find()
    res.status(200).json(orders)
})

export const getUserOrder = asyncHandler(async(req, res, next) => {
    //creating a separate document with each course inside courses array
    // const pipeline = [
    //     { $unwind : "$courses" }
    // ]
    // const allOrders = await Order.aggregate(pipeline)
    const orders = await Order.find({userId: req.user.id}).populate('courseId', 'title price _id')

    console.log("⚓🛩", orders)
    if(!orders) return next(ErrorHandler(204, 'No order found for this user'))

    res.status(200).json({orders})
})

// export const courseOrderStat = asyncHandler(async(req, res, next) => {
//     const {id} = req.user
//     const allPublishedCourses = await Course.find({createdBy: id})
//     const courseOrderData = await Order.find({})
// })