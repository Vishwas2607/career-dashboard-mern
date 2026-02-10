import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";
import { profileDetails } from "../controllers/profile.controller.js";

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware, profileDetails);

export default profileRouter;