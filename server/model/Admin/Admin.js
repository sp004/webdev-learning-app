import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    id: {
        type: String,
    },
    fullName: {
        type: String,
        default: "Admin"
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    avatar: {
        type: String,
    },
    token: {
        type: String,
    }
}, { timestamps: true })

export default mongoose.model('Admin', AdminSchema)