import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Title cannot be empty"],
    },
    description: {
        type: String,
        required: [true, "Description cannot be empty"],
    },
    category: {
        type: String,
        required: [true, "Category cannot be empty"],
    },
    // tech-stack: {
    //     type: [String],
    // },
    level: {
        type: String,
        required: [true, "Level cannot be empty"],
    },
    price: {
        type: Number,
        required: [true, "Price cannot be empty"],
    },
    thumbnail: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    uploadedOn: {
        type: Date,
        default: new Date(Date.now())
    },
    rating: {
        type: Number,
        default: 0
    },
    courseContent: [
        {
            lecture: {
                type: String,
                required: [true, "Lecture cannot be empty"],
            },
            duration: {
                type: Number,
                required: [true, "Duration cannot be empty"],
            },
            discussion: {
                type: String,
                required: [true, "Discussion cannot be empty"],
            }
        }
    ],
    approved: {
        type: String,
        enum: ['yes', 'no', 'rejected'],
        default: 'no',
    },
    approvedOn: {
        type: Date,
        // default: Date.now(),
    }
})

export default mongoose.model('Course', CourseSchema)