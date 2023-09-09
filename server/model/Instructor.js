import mongoose from "mongoose";

const InstructorSchema = new mongoose.Schema({
    designation: {
        type: String,
        trim: true,
        required: [true, 'This field is required'],
    },
    bio: {
        type: String,
        required: [true, 'This field is required'],
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    // publishedCourses: [
    //     {
    //         courseId: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'Course'
    //         },
    //         status: {
    //             type: String,
    //             enum: ['Active', 'Draft']
    //         }
    //     }
    // ]
}, {timestamps: true})

export default mongoose.model('Instructor', InstructorSchema)