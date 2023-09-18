import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/connectDB.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoute.js'
import userRouter from './routes/userRoute.js'
import InstructorRouter from './routes/InstructorRoute.js'
import courseRouter from './routes/courseRoute.js'
import enrolledCourseRouter from './routes/enrolledCourseRoute.js'
import Razorpay from "razorpay";
import checkoutRouter from './routes/checkoutRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import orderRouter from './routes/orderRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import cartRouter from './routes/cartRoute.js'
// import session from 'express-session'
import cookieSession from 'cookie-session'
// import { limiter } from './middlewares/rateLimiter.js'

const app = express()
dotenv.config()

app.use(cors({
  origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
  credentials: true,
}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(cookieParser())

app.use(
  cookieSession({ name: "secret", keys: ["lama"], maxAge: 24 * 60 * 60 })
);

// app.use(session({
//   secret: 'secret',
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60,
//     sameSite: 'None',
//     httpOnly: true
//   }
// }))

const port = process.env.PORT || 5500

connectDB()

//CREATE RAZORPAY INSTANCE
export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

//apply rate limiter to api routes
// app.use('/api/', limiter);

//routes 
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)
app.use('/api/instructor', InstructorRouter)
app.use('/api/course', courseRouter)
app.use('/api/order', orderRouter)
app.use('/api/enrolledCourse', enrolledCourseRouter)
app.use('/api/review', reviewRouter)
app.use('/api/cart', cartRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/payment', checkoutRouter)

app.get('*', (req, res) => res.send('Page not found'))

app.use((err, req, res, next) => {
    console.log("error: ", err)
    const errStatus = err.status ? err.status : 500
    const errMsg = err?.message ? err?.message : 'Something went wrong'
    const stack = process.env.NODE_ENV !== 'production' ? err.stack : null
    res.status(errStatus).json({status: 'error', message: errMsg, stack})
})

mongoose.connection.on('open', () => {
    console.log("Connection established")
    app.listen(port, () => console.log(`Webskool server listening on port ${port}!`))
})