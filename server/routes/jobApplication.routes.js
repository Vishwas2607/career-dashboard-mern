import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { addJob, deleteJob, getJobs, jobDetails, jobStats, updateJob } from "../controllers/jobApplication.controller.js";

const jobRouter = express.Router();

jobRouter.use(authMiddleware);

jobRouter.post("/",addJob);

jobRouter.get("/",getJobs);

jobRouter.get("/jobstats", jobStats);

jobRouter.put("/:jobId",updateJob);

jobRouter.delete("/:jobId",deleteJob);

jobRouter.get("/:jobId", jobDetails);

export default jobRouter;