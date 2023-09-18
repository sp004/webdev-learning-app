import User from "../model/User.js";
import { ErrorHandler } from "./ErrorHandler.js";
import jwt from 'jsonwebtoken';

export const verifyJWT = async (req, res, next) => {
    const {token} = req.cookies
    if (!token) return res.status(401).json({message: 'You aren\'t authorized, Please login'});

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async(err, decoded) => {
            if (err) {
                console.log(err)
                return next(ErrorHandler(401, 'Invalid token! Please login')) //invalid token
            }

            req.user = decoded
            next();
        }
    );
}

//verify instructor
export const verifyInstructor = async (req, res, next) => {
    verifyJWT(req, res, async () => {
        const user = await User.findById(req.user.id)
        req.user.isInstructor = user?.isInstructor
        if (req.user?.isInstructor) {
            next();
        }else{
            return next(ErrorHandler(403, "You need instructor account to create courses"))
        }
    })
}