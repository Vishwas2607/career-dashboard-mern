import mongoose from "mongoose";
import JobCollection from "../models/jobApplication.model.js";
import countJobs from "../utils/helpers.js";
import { ApplicationsPerMonth } from "../utils/helpers.js";
import { AppError } from "../utils/AppError.js";
import User from "../models/user.model.js";

export const addJob =  async(req,res)=> {
    const userId = req.user?.sub;

    if(!userId) {
        throw new AppError("Unauthorized", 401);
    };

    const {companyName,role,location,appliedDate,status,jobLink,notes} = req.body;

    if (!companyName || !role || !jobLink){
        throw new AppError("Comapany name, Role, Job Link are required fields.", 400);
    };
    
    const jobDetails = {
        user: userId,
        companyName,
        role,
        location,
        appliedDate,
        status,
        jobLink,
        notes
        };


    const newJob = await JobCollection.create(jobDetails)

    res.status(201).json({message:"Successfully added new job detail", newJob:newJob}) ;    

};

export const getJobs = async (req, res) => {
  const userId = req.user?.sub;
  const { status, from, to, page } = req.query;

  const limit = 10;
  const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (pageNumber - 1) * limit;

  const query = { user: userId };

  if (status) {
    query.status = status;
  }

  if (from || to) {
    query.createdAt = {
      ...(from && { $gte: new Date(from) }),
      ...(to && { $lte: new Date(to) }),
    };
  }

  const jobs = await JobCollection.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);

  const totalJobs = await JobCollection.countDocuments(query);

  if (totalJobs === 0) {
    throw new AppError("No job details found", 404);
  }

  const totalPages = Math.ceil(totalJobs / limit);
  const nextPage = pageNumber < totalPages;

  res.status(200).json({
    jobs,
    nextPage,
    totalPages,
    currentPage: pageNumber,
  });
};


export const deleteJob = async(req,res)=> {
    const userId = req.user?.sub;
    const jobId = req.params?.jobId;

    const deletedJob = await JobCollection.findOneAndDelete({user:userId, _id: jobId});

    if (!deletedJob) { 
        throw new AppError("Job or User not found", 404);
    };

    res.status(200).json({message: "Successfully deleted."});

};


export const updateJob = async(req,res)=> {
    const userId = req.user?.sub;
    const jobId = req.params?.jobId;

    const fields = ["companyName","role","location","appliedDate","status","jobLink","notes"];
    const updateFields = {};

    fields.forEach(f => {
        if (req.body[f] !== undefined) updateFields[f] = req.body[f];
    });


    const updatedJob = await JobCollection.findOneAndUpdate(
        {user: userId, _id: jobId},
        {$set: updateFields},
        {new:true, runValidators: true}
    );

    if (!updatedJob) {
        throw new AppError("Job or User not found", 404);
    };

    res.status(200).json({updatedJob: updatedJob});
};


export const jobDetails = async(req,res) => {
    const userId = req.user?.sub;
    const jobId = new mongoose.Types.ObjectId(req.params?.jobId);

    if(!jobId) {
        throw new AppError("Job Id not provided", 404);
    };        

    const jobDetail = await JobCollection.findOne({_id: jobId, user : userId});

    if (!jobDetail){
        throw new AppError("Job not found", 404);
    };

    res.status(200).json({jobDetail});
};

export const jobStats = async(req,res)=> {
    const userId = req.user?.sub;

    const jobs = await JobCollection.find({user:userId});

    if(!jobs.length) {
        throw new AppError("No Jobs or Jobs not found", 404);
    };

    const totalApplication = jobs.length;
    const interviewing = countJobs("interviewing",jobs);
    const offered = countJobs("offered", jobs);
    const rejected = countJobs("rejected", jobs);
    const applied = totalApplication -(interviewing + offered+ rejected);
    const today = new Date();
    const year = today.getFullYear();

    const applicationsPerMonth = {};
    for (let m = 1; m <= 12; m++) {
        applicationsPerMonth[m] = ApplicationsPerMonth(`${m}/${year}`, jobs);
    };
    res.status(200).json({totalApplication:totalApplication,applied:applied, interviewing:interviewing, offered:offered, rejected:rejected, applicationPerMonth: {jan:applicationsPerMonth[1], feb:applicationsPerMonth[2], mar:applicationsPerMonth[3], apr:applicationsPerMonth[4], may:applicationsPerMonth[5], jun:applicationsPerMonth[6], jul:applicationsPerMonth[7], aug:applicationsPerMonth[8], sep:applicationsPerMonth[9], oct:applicationsPerMonth[10], nov:applicationsPerMonth[11], dec:applicationsPerMonth[12]}});
};


