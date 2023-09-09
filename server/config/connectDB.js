import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.error(error)
    }
}

export default connectDB