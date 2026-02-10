import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=> {

    const token = req.cookies.accessToken;

    if(!token) {
        const error = new Error("Not Authorized");
        error.statusCode = 401;
        return next(error)
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.log("Critical: JWT_SECRET is missing from .env");
        const error = new Error("JWT_SECRET not defined");
        error.statusCode = 500;
        return next(error);
    };

    const user = jwt.verify(token,process.env.JWT_SECRET);

    req.user = user;
    next();
};

export default authMiddleware