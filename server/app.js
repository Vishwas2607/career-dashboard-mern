import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import jobRouter from "./routes/jobApplication.routes.js";
import profileRouter from "./routes/profile.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();
app.use(helmet());

const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());


app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));


if(process.env.NODE_ENV=== "development"){
    app.use(morgan('dev'));
};

app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "development" ? 1000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/",limiter);

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRouter);
app.use("/api/profile", profileRouter);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;