import mongoose from "mongoose";
import jobSchema from "./jobApplication.model.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase:true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: 8
    },
    refreshToken: String,
  },
    {
    timestamps: true,
    }
);

const User = mongoose.model("user",userSchema); 

export default User