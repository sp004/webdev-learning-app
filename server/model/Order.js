import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    orderId: {
        type: String,
    },
    paymentId: {
        type: String
    },
    purchasedDate: {
        type: Date,
        default: new Date(Date.now())
    },
    refundAvailableTill: {
        type: Date,
        default: new Date(Date.now() + 86400000),
    },
    status: {
        type: String,
        enum: ['Enrolled', 'Refunded'],
        default: 'Enrolled'
    }
})

export default mongoose.model('Order', OrderSchema)