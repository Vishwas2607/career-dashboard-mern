import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError.js";

export const authRegister = async(req,res)=> {
    const {username,email,password} = req.body;

    if(!username || !email || !password) {
        throw new AppError("All fields are required !!!", 400);
    };

    const savedEmail = await User.findOne({email:email})

    if (savedEmail) {
        throw new AppError("Email already registered.", 400);
    };

    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.create({
        username: username,
        email: email,
        password: hashedPassword,
    });

    const savedUser = {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
    };

    res.status(201).json({message: `User ${username} registered successfully.`, saveduser: savedUser})
};

const nodeEnv = process.env.NODE_ENV;

export const authLogin = async(req,res)=> {

    const {email,password} = req.body;
    if(!email || !password){
        throw new AppError("All fields are required !!!", 400);
    };

    const user = await User.findOne({email: email});
    if(!user) {
        throw new AppError("Invalid email or password !!!", 401);
    };

    const isMatch = await bcrypt.compare(password,user.password);

    if (isMatch){
    const accessToken = jwt.sign({
            sub: user._id,
            email: email
        },
        process.env.JWT_SECRET,
        {expiresIn: "15m"});

        const refreshToken = jwt.sign({
            sub: user._id,
            email: email
        },
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "7d"});

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken,{
            httpOnly: true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15*60*1000,
            path: "/",
        }).cookie("refreshToken", refreshToken,{
            httpOnly:true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV=== "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        }).status(200).json({message: "Login successful", user: {id: user._id, name: user.username, email:user.email} });
    } else{
    throw new AppError("Unauthorized", 401);
    }
};


export const authRefreshToken = async(req,res) => {
    const token = req.cookies.refreshToken;
    if(!token) {
        throw new AppError("Unauthorized", 401);
    };

    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.sub);
    if(!user || user.refreshToken !== token){
    res.clearCookie("accessToken",{
            httpOnly: true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV === "production", path:"/"})
    .clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV === "production", path:"/"})
        throw new AppError("Forbidden", 403);
    };

    const newAccessToken = jwt.sign({
            sub: payload.sub,
            email: payload.email,
        },
        process.env.JWT_SECRET,
        {expiresIn: "15m"});

    const newRefreshToken = jwt.sign({
        sub: payload.sub,
        email: payload.email,
    },
    process.env.JWT_REFRESH_SECRET,
    {expiresIn: "7d"}
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("accessToken", newAccessToken,{
            httpOnly: true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000,
            path: "/"
        }).cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
            })
            
       return res.json({message:"Access token refreshed"});
};

export const authLogout = async (req,res) => {
    const token = req.cookies.refreshToken;
    if(!token) {
        throw new AppError("Unauthorized", 401);
    };

    const payload = jwt.verify(token,process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.sub);
    if(!user) {
        throw new AppError("User not found", 404);
    };

    user.refreshToken = null;
    await user.save();

    res
    .clearCookie("accessToken",{
            httpOnly: true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV === "production", path:"/"})
    .clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: nodeEnv === "development" ? "strict" : "none",
            secure: process.env.NODE_ENV === "production", path:"/"})
    .json({message: "Logged out"});

};