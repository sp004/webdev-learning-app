import express from 'express';
import { generateOtp, googleAuthController, loginWithOtp, logoutUser, registerUser, sendOtpToEmail } from '../controller/auth.js';
const authRouter = express.Router()

authRouter.post('/register', registerUser)
authRouter.post('/login', generateOtp)
authRouter.post('/sendOtp/:email', sendOtpToEmail)
authRouter.post('/loginWithOtp/:email', loginWithOtp)
authRouter.post('/google/callback', googleAuthController)

authRouter.get('/logout', logoutUser)

export default authRouter