import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    companyName: {type: String, required:[true, "Company name is required"]},
    role: {type: String, required:[true, "Role is required"]},
    location : {
        type: String,
        enum: ["remote", "onsite", "hybrid"],
        default: 'remote'
    },
    appliedDate: {type:Date, default: Date.now},
    status: {
        type: String,
        enum: ['applied', 'interviewing', 'offered', 'rejected'],
        default: 'applied'
    },
    jobLink: {type: String, required:[true, "Job Link is required"]},
    notes: String,
    },{

    timestamps: true,
})

const JobCollection = mongoose.model("JobCollection", jobSchema);
export default JobCollection;

