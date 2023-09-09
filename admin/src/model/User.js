import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    avatar: {
        type: String,
    },
    isInstructor: {
        type: Boolean,
    },
    token: {
        type: String,
    }
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User