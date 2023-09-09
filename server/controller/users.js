import asyncHandler from "express-async-handler"
import { ErrorHandler } from "../middlewares/ErrorHandler.js"
import User from "../model/User.js"
import { createImageFromInitials, getRandomColor } from "../utils/generateAvatar.js"

export const getUserProfile = asyncHandler(async (req, res, next) => {
    // console.log(req.user)

    const user = await User.findOne({_id: req.user?.id?.toString()})
    if(!user) return next(ErrorHandler(404, 'No user found'))
    res.status(200).json(user)
})

export const updateUser = async (req, res, next) => {
    const {fullName, avatar} = req.body
    console.log(fullName, avatar)
    try {
        //find user's info by it's id
        const user = await User.findByIdAndUpdate(req.user.id,
            {   
                $set: {
                    fullName: req.body?.fullName,
                    avatar: req.body?.avatar
                }
            }, {new: true}
        ).exec()
        if(!user) return next(ErrorHandler(404, 'No user found'))

        // user.fullName = fullName || user.fullName
        // user.avatar = avatar 
        //                 ? avatar 
        //                 : fullName
        //                     ? createImageFromInitials(40, fullName, getRandomColor()) 
        //                     : user.avatar
        // await user.save()

        res.status(200).json({user, message: 'User updated successfully'})
    } catch (error) {
        next(error)
    }
}

//delete user profile
export const deleteUser = async (req, res, next) => {
    console.log(req.params?.id)
    const user = await User.findById({_id: req.params?.id})
    if(!user) return next(ErrorHandler(404, 'No user found'))

    await user.delete()
    res.status(200).json({status: 'Success', message: `${user.name} is deleted`})
}