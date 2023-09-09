import { connect, connection, set } from "mongoose";

const connectDB = async() => {
    try {
        set("strictQuery", false);
        connect(process.env.MONGO_URI)

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })
    } catch (error) {
        throw new Error("Something went wrong in database connection")
    }
}

export default connectDB