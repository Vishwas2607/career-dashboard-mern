import JobCollection from "../models/jobApplication.model.js";
import User from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";

export const profileDetails = async(req,res) => {
    const userId = req.user.sub;
    const user = await User.findById(userId);

    if(!user) {
        throw new AppError("User not found", 404);
    };
    const totalJobs = await JobCollection.countDocuments({user:userId});
    res.status(200).json({username: user.username, email:user.email, totalJobs: totalJobs});
    
};