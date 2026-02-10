import mongoose from "mongoose";

export default async function  connectDB() {
    try{
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined")
        }
        await mongoose.connect(mongoURI);
        console.log("✅ Connected to MongoDB.")
    } catch(err) {
        console.error("❌ MongoDB connection failed");
        throw err;
    }
};


