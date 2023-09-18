import asyncHandler from "express-async-handler";
import { ErrorHandler } from "../middlewares/ErrorHandler.js";
import User from "../model/User.js";
import jwt from 'jsonwebtoken'
import Token from "../model/Token.js";
import CryptoJS from 'crypto-js'
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from 'google-auth-library'
import { createImageFromInitials, getRandomColor } from "../utils/generateAvatar.js";

export const registerUser = asyncHandler(async(req, res, next) => {
    const { fullName, email } = req.body;

    try {
        //if the email already exists
        const duplicate = await User.findOne({ email }).exec()
        if (duplicate) {
            return next(ErrorHandler(409, 'Email already exists'))
        }
    
        const newUser = await User.create(req.body)
    
        const profileImage = createImageFromInitials(40, fullName, getRandomColor())
        newUser.avatar = profileImage
        await newUser.save()
    
        if(newUser){
            res.status(201).json({ newUser, message: 'Successfully registered' })
        }else{
            return next(ErrorHandler(400, 'Invalid user details'))
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = error.errors?.fullName?.message || error.errors?.email?.message;
            res.status(400).json({ message: errorMessage });
          } else {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
          }
    }
})

export const generateOtp = asyncHandler(async(req, res, next) => {
    const {email} = req.body
    
    const user = await User.findOne({ email }).exec()
    if(!user) return next(ErrorHandler(404, 'Email is not registered'))
    
    const loginOtp = Math.floor(100000 + Math.random() * 900000);
    // const encryptedOtp = CryptoJS.SHA256(loginOtp).toString(CryptoJS.enc.Hex)
    const encryptedOtp = CryptoJS.AES.encrypt(loginOtp.toString(), process.env.LOGINCODE_SECRET_KEY, {iv: process.env.INITIALIZATION_VECTOR}).toString()
    
    // Delete token if it exists in DB
    let loginToken = await Token.findOne({ userId: user._id });
    if (loginToken) {
      await loginToken.deleteOne()
    }
    
    //save new token to DB
    await new Token({
        userId: user._id,
        loginToken: encryptedOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + (2 * 60 * 1000), //valid till 2 minutes
    }).save();
    
    res.status(200).json({message: "OTP generated", loginOtp, valid: 120})
})

//when user clicks Continue button to get the otp to login
export const sendOtpToEmail = asyncHandler(async(req, res, next) => {
    const { email } = req.params;

    const user = await User.findOne({ email }).exec();
    if(!user) return next(ErrorHandler(404, 'user not found'))
    
    //find the login token(encrypted otp) in DB
    const userToken = await Token.findOne(
        {
            userId: user._id,
            //expiresAt: {$gt: Date.now()} //expiresAt should be greater than current time
        })
        console.log(userToken)
    if(!userToken) return next(ErrorHandler(404, 'Token is invalid, please login again'))

    const otp = CryptoJS.AES.decrypt(userToken.loginToken, process.env.LOGINCODE_SECRET_KEY, {iv: process.env.INITIALIZATION_VECTOR}).toString(CryptoJS.enc.Utf8)

    // Reset Email options
    const subject = "Login OTP";
    const from = process.env.EMAIL_USER;
    const to = email;
    const replyTo = "no-reply@webskool.com";
    const template = "otpVerify";
    const name = user?.fullName;
    const link = otp;

    try {
        const response = await sendEmail(subject, from, to, replyTo, template, name, link)
        console.log(response);
        res.status(200).json({message: 'OTP sent', otp})
    } catch (error) {
        return next(ErrorHandler(500, 'Email not sent, please try again'))
    }
})

//when user clicks Continue button to get the otp to login
export const loginWithOtp = asyncHandler(async(req, res, next) => {
    const { email } = req.params;
    const {otp} = req.body;

    const user = await User.findOne({ email }).exec();
    if(!user) return next(ErrorHandler(404, 'User not found'))

    const userToken = await Token.findOne(
        {
            userId: user._id,
            expiresAt: {$gt: Date.now()} //expiresAt should be greater than current time
        })
    if(!userToken) return next(ErrorHandler(401, 'Invalid OTP'))

    //otp decypted from token stored in db
    const otpDB = CryptoJS.AES.decrypt(userToken.loginToken, process.env.LOGINCODE_SECRET_KEY, {iv: process.env.INITIALIZATION_VECTOR}).toString(CryptoJS.enc.Utf8)

    if(parseInt(otpDB) !== otp){
        return next(ErrorHandler(400, 'Incorrect OTP'))
    }

    //create token
    const token = jwt.sign(
        { id: user?._id, isInstructor: user?.isInstructor }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '1d' }
    )
    user.token = token
    await user.save()

    //send cookie to frontend
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        // expiresIn: new Date(Date.now() + (1000 * 86400)),
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: 'None'
    })

    res.status(200).json({ message: "Login successful", user})
})

export const logoutUser = asyncHandler(async(req, res, next) => {
    const {token} = req.cookies 

    if(!token) return next(ErrorHandler(204, 'Your session has ended, please login again'))
    const refreshToken = token;

    const user = await User.findOne({token: refreshToken}).exec()
    if(!user){
        res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true })
        return res.status(200).json({message: 'No user found'})
    }
    
    user.token = ''
    await user.save()

    res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true })
    return res.status(200).json({message: 'Logout successful'})
})

//google login controller
export const googleAuthController = asyncHandler(async(req, res) => {
    //token coming from frontend while clicking on sign in with google button
    const {userToken} = req.body
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID) 

    const ticket = await client.verifyIdToken({
        idToken: userToken,
        audience: process.env.GOOGLE_CLIENT_ID
    })
    const payload = ticket.getPayload()
    const {name, email} = payload

    //check if the user is already registered
    const user = await User.findOne({email})

    if(user){
        //accesstoken creation with id
        const token = jwt.sign({ id: user._id, isInstructor: user.isInstructor }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        user.token = token
        await user.save()

        res.status(200).json({message: "Successfully logged in", user})
    }else{
        const newUser = await User.create({
            fullName: name,
            email
        })
        
        //accesstoken creation with id
        const token = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300m' })
        
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 4 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        });

        const user = await User.findOne({ email }).exec()
        const profileImage = createImageFromInitials(40, user?.fullName, getRandomColor())
        
        newUser.token = token
        newUser.avatar = profileImage
        await newUser.save()

        res.status(201).json({message: "Account created successfully", user: newUser})
    }
})