import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    rating: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    reviewDate: {
        type: Date,
        default: new Date(Date.now())
    }
})

export default mongoose.model('Review', ReviewSchema)