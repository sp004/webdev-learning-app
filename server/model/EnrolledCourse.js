import mongoose from "mongoose";

const EnrolledCourseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    courseId: {
        type: mongoose.Types.ObjectId,
        ref: "Course",
    },
    enrolledOn: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model('EnrolledCourse', EnrolledCourseSchema)