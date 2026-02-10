import express from "express";
import { authLogin, authLogout, authRegister, authRefreshToken } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", authRegister);

authRouter.post("/login", authLogin);

authRouter.post("/logout", authLogout);

authRouter.post("/token/refresh", authRefreshToken);

export default authRouter;