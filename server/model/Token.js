import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    loginToken: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: new Date(Date.now())
    },
    expiresAt: {
        type: Date,
        default: new Date(Date.now() + 120000),
    }
})

export default mongoose.model('Token', TokenSchema)