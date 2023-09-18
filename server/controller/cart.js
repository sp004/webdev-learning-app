import Cart from "../model/Cart.js"
import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";

//add to the cart
export const insertCart = asyncHandler(async(req, res, next) => {
    const {courseId} = req.params 

    const cart = await Cart.create({courseId, userId: req.user.id?.toString()})
    res.status(201).json({status: 'Success', message: "Course is added to cart"})
})

//get cart data
export const getCartData = asyncHandler(async(req, res, next) => {
    const coursesInCart = await Cart.find({userId: req.user.id?.toString()})
                        .populate({
                            path: "courseId",
                            populate: {
                                path: "createdBy",
                                model: "User",
                                select: 'fullName'
                            }
                        })
                        .select("-_id -userId")

    const totalPrice = coursesInCart.reduce((total, course) => total + course?.courseId?.price, 0);

    res.status(201).json({data: coursesInCart, totalPrice})
})

//remove item from cart
export const removeCourseFromCart = asyncHandler(async(req, res, next) => {
    const {courseId} = req.params

    const courseToRemoveFromCart = await Cart.findOne({courseId: courseId.toString(), userId: req.user.id?.toString()})
    if(!courseToRemoveFromCart) return next(ErrorHandler(204, 'Course is not in the cart'))

    await Cart.findOneAndDelete({courseId, userId: req.user.id})

    res.status(200).json({status: 'Success', message: "Course is rmeoved from cart"})
})

//remove all courses from cart of logged in user
export const clearUserCart = asyncHandler(async(req, res, next) => {
    const courseToRemoveFromCart = await Cart.deleteMany({userId: req.user.id})
    if(!courseToRemoveFromCart) return next(ErrorHandler(404, 'No courses are in the cart'))

    res.status(200).json({status: 'Success', message: "All courses are rmeoved from cart"})
})