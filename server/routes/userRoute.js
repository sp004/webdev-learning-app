import express from 'express';
import { deleteUser, getUserProfile, updateUser } from '../controller/users.js';
import { verifyJWT } from '../middlewares/verifyToken.js';

const userRouter = express.Router()

userRouter.get('/profile', verifyJWT, getUserProfile)
userRouter.put('/edit', verifyJWT, updateUser)
userRouter.delete('/delete/:id', verifyJWT, deleteUser)

export default userRouter