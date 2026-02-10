var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
));

// server.js
var import_config = require("dotenv/config");

// config/db.connection.js
var import_mongoose = __toESM(require("mongoose"), 1);
async function connectDB() {
  try {
    let mongoURI = process.env.MONGO_URI;
    if (!mongoURI)
      throw new Error("MONGO_URI is not defined");
    await import_mongoose.default.connect(mongoURI);
  } catch (err) {
    throw console.error("\u274C MongoDB connection failed"), err;
  }
}

// app.js
var import_express4 = __toESM(require("express"), 1), import_cors = __toESM(require("cors"), 1);

// routes/auth.routes.js
var import_express = __toESM(require("express"), 1);

// models/user.model.js
var import_mongoose3 = __toESM(require("mongoose"), 1);

// models/jobApplication.model.js
var import_mongoose2 = __toESM(require("mongoose"), 1), jobSchema = new import_mongoose2.default.Schema({
  user: {
    type: import_mongoose2.default.Schema.Types.ObjectId,
    ref: "user",
    required: !0
  },
  companyName: { type: String, required: [!0, "Company name is required"] },
  role: { type: String, required: [!0, "Role is required"] },
  location: {
    type: String,
    enum: ["remote", "onsite", "hybrid"],
    default: "remote"
  },
  appliedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["applied", "interviewing", "offered", "rejected"],
    default: "applied"
  },
  jobLink: { type: String, required: [!0, "Job Link is required"] },
  notes: String
}, {
  timestamps: !0
}), JobCollection = import_mongoose2.default.model("JobCollection", jobSchema), jobApplication_model_default = JobCollection;

// models/user.model.js
var userSchema = new import_mongoose3.default.Schema(
  {
    username: {
      type: String,
      required: [!0, "Username is required."],
      trim: !0
    },
    email: {
      type: String,
      required: [!0, "Email is required."],
      unique: !0,
      trim: !0,
      lowercase: !0
    },
    password: {
      type: String,
      required: [!0, "Password is required."],
      minlength: 8
    },
    refreshToken: String
  },
  {
    timestamps: !0
  }
), User = import_mongoose3.default.model("user", userSchema), user_model_default = User;

// controllers/auth.controller.js
var import_bcryptjs = __toESM(require("bcryptjs"), 1), import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);

// utils/AppError.js
var AppError = class extends Error {
  constructor(message, statusCode) {
    super(message), this.statusCode = statusCode;
  }
};

// controllers/auth.controller.js
var authRegister = async (req, res) => {
  let { username, email, password } = req.body;
  if (!username || !email || !password)
    throw new AppError("All fields are required !!!", 400);
  if (await user_model_default.findOne({ email }))
    throw new AppError("Email already registered.", 400);
  let salt = await import_bcryptjs.default.genSalt(10), hashedPassword = await import_bcryptjs.default.hash(password, salt), newUser = await user_model_default.create({
    username,
    email,
    password: hashedPassword
  }), savedUser = {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email
  };
  res.status(201).json({ message: `User ${username} registered successfully.`, saveduser: savedUser });
}, authLogin = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    throw new AppError("All fields are required !!!", 400);
  let user = await user_model_default.findOne({ email });
  if (!user)
    throw new AppError("Invalid email or password !!!", 401);
  if (await import_bcryptjs.default.compare(password, user.password)) {
    let accessToken = import_jsonwebtoken.default.sign(
      {
        sub: user._id,
        email
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    ), refreshToken = import_jsonwebtoken.default.sign(
      {
        sub: user._id,
        email
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken, await user.save(), res.cookie("accessToken", accessToken, {
      httpOnly: !0,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 900 * 1e3,
      path: "/"
    }).cookie("refreshToken", refreshToken, {
      httpOnly: !0,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 10080 * 60 * 1e3,
      path: "/"
    }).status(200).json({ message: "Login successful", user: { id: user._id, name: user.username, email: user.email } });
  } else
    throw new AppError("Unauthorized", 401);
}, authRefreshToken = async (req, res) => {
  let token = req.cookies.refreshToken;
  if (!token)
    throw new AppError("Unauthorized", 401);
  let payload = import_jsonwebtoken.default.verify(token, process.env.JWT_REFRESH_SECRET), user = await user_model_default.findById(payload.sub);
  if (!user || user.refreshToken !== token)
    throw res.clearCookie("accessToken", {
      httpOnly: !0,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    }).clearCookie("refreshToken", {
      httpOnly: !0,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/"
    }), new AppError("Forbidden", 403);
  let newAccessToken = import_jsonwebtoken.default.sign(
    {
      sub: payload.sub,
      email: payload.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  ), newRefreshToken = import_jsonwebtoken.default.sign(
    {
      sub: payload.sub,
      email: payload.email
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return user.refreshToken = newRefreshToken, await user.save(), res.cookie("accessToken", newAccessToken, {
    httpOnly: !0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 900 * 1e3,
    path: "/"
  }).cookie("refreshToken", newRefreshToken, {
    httpOnly: !0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 10080 * 60 * 1e3,
    path: "/"
  }), res.json({ message: "Access token refreshed" });
}, authLogout = async (req, res) => {
  let token = req.cookies.refreshToken;
  if (!token)
    throw new AppError("Unauthorized", 401);
  let payload = import_jsonwebtoken.default.verify(token, process.env.JWT_REFRESH_SECRET), user = await user_model_default.findById(payload.sub);
  if (!user)
    throw new AppError("User not found", 404);
  user.refreshToken = null, await user.save(), res.clearCookie("accessToken", {
    httpOnly: !0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  }).clearCookie("refreshToken", {
    httpOnly: !0,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  }).json({ message: "Logged out" });
};

// routes/auth.routes.js
var authRouter = import_express.default.Router();
authRouter.post("/register", authRegister);
authRouter.post("/login", authLogin);
authRouter.post("/logout", authLogout);
authRouter.post("/token/refresh", authRefreshToken);
var auth_routes_default = authRouter;

// routes/jobApplication.routes.js
var import_express2 = __toESM(require("express"), 1);

// middleware/authMiddleware.js
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1), authMiddleware = (req, res, next) => {
  let token = req.cookies.accessToken;
  if (!token) {
    let error = new Error("Not Authorized");
    return error.statusCode = 401, next(error);
  }
  if (!process.env.JWT_SECRET) {
    let error = new Error("JWT_SECRET not defined");
    return error.statusCode = 500, next(error);
  }
  let user = import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);
  req.user = user, next();
}, authMiddleware_default = authMiddleware;

// controllers/jobApplication.controller.js
var import_mongoose4 = __toESM(require("mongoose"), 1);

// utils/helpers.js
function countJobs(status, lst) {
  let count = 0;
  return lst.forEach((job) => {
    job.status === status && count++;
  }), count;
}
function ApplicationsPerMonth(monthYear, data = []) {
  let count = 0;
  return data.forEach((job) => {
    new Date(job.createdAt).toLocaleDateString().slice(2) === monthYear && count++;
  }), count;
}

// controllers/jobApplication.controller.js
var addJob = async (req, res) => {
  let userId = req.user?.sub;
  if (!userId)
    throw new AppError("Unauthorized", 401);
  let { companyName, role, location, appliedDate, status, jobLink, notes } = req.body;
  if (!companyName || !role || !jobLink)
    throw new AppError("Comapany name, Role, Job Link are required fields.", 400);
  let jobDetails2 = {
    user: userId,
    companyName,
    role,
    location,
    appliedDate,
    status,
    jobLink,
    notes
  }, newJob = await jobApplication_model_default.create(jobDetails2);
  res.status(201).json({ message: "Successfully added new job detail", newJob });
}, getJobs = async (req, res) => {
  let userId = req.user?.sub, { status, from, to, page } = req.query, limit = 10, pageNumber = Math.max(parseInt(page, 10) || 1, 1), skip = (pageNumber - 1) * limit, query = { user: userId };
  status && (query.status = status), (from || to) && (query.createdAt = {
    ...from && { $gte: new Date(from) },
    ...to && { $lte: new Date(to) }
  });
  let jobs = await jobApplication_model_default.find(query).sort({ createdAt: -1 }).limit(limit).skip(skip), totalJobs = await jobApplication_model_default.countDocuments(query);
  if (totalJobs === 0)
    throw new AppError("No job details found", 404);
  let totalPages = Math.ceil(totalJobs / limit), nextPage = pageNumber < totalPages;
  res.status(200).json({
    jobs,
    nextPage,
    totalPages,
    currentPage: pageNumber
  });
}, deleteJob = async (req, res) => {
  let userId = req.user?.sub, jobId = req.params?.jobId;
  if (!await jobApplication_model_default.findOneAndDelete({ user: userId, _id: jobId }))
    throw new AppError("Job or User not found", 404);
  res.status(200).json({ message: "Successfully deleted." });
}, updateJob = async (req, res) => {
  let userId = req.user?.sub, jobId = req.params?.jobId, fields = ["companyName", "role", "location", "appliedDate", "status", "jobLink", "notes"], updateFields = {};
  fields.forEach((f) => {
    req.body[f] !== void 0 && (updateFields[f] = req.body[f]);
  });
  let updatedJob = await jobApplication_model_default.findOneAndUpdate(
    { user: userId, _id: jobId },
    { $set: updateFields },
    { new: !0, runValidators: !0 }
  );
  if (!updatedJob)
    throw new AppError("Job or User not found", 404);
  res.status(200).json({ updatedJob });
}, jobDetails = async (req, res) => {
  let userId = req.user?.sub, jobId = new import_mongoose4.default.Types.ObjectId(req.params?.jobId);
  if (!jobId)
    throw new AppError("Job Id not provided", 404);
  let jobDetail = await jobApplication_model_default.findOne({ _id: jobId, user: userId });
  if (!jobDetail)
    throw new AppError("Job not found", 404);
  res.status(200).json({ jobDetail });
}, jobStats = async (req, res) => {
  let userId = req.user?.sub, jobs = await jobApplication_model_default.find({ user: userId });
  if (!jobs.length)
    throw new AppError("No Jobs or Jobs not found", 404);
  let totalApplication = jobs.length, interviewing = countJobs("interviewing", jobs), offered = countJobs("offered", jobs), rejected = countJobs("rejected", jobs), applied = totalApplication - (interviewing + offered + rejected), year = (/* @__PURE__ */ new Date()).getFullYear(), applicationsPerMonth = {};
  for (let m = 1; m <= 12; m++)
    applicationsPerMonth[m] = ApplicationsPerMonth(`${m}/${year}`, jobs);
  res.status(200).json({ totalApplication, applied, interviewing, offered, rejected, applicationPerMonth: { jan: applicationsPerMonth[1], feb: applicationsPerMonth[2], mar: applicationsPerMonth[3], apr: applicationsPerMonth[4], may: applicationsPerMonth[5], jun: applicationsPerMonth[6], jul: applicationsPerMonth[7], aug: applicationsPerMonth[8], sep: applicationsPerMonth[9], oct: applicationsPerMonth[10], nov: applicationsPerMonth[11], dec: applicationsPerMonth[12] } });
};

// routes/jobApplication.routes.js
var jobRouter = import_express2.default.Router();
jobRouter.use(authMiddleware_default);
jobRouter.post("/", addJob);
jobRouter.get("/", getJobs);
jobRouter.get("/jobstats", jobStats);
jobRouter.put("/:jobId", updateJob);
jobRouter.delete("/:jobId", deleteJob);
jobRouter.get("/:jobId", jobDetails);
var jobApplication_routes_default = jobRouter;

// routes/profile.routes.js
var import_express3 = __toESM(require("express"), 1);

// controllers/profile.controller.js
var profileDetails = async (req, res) => {
  let userId = req.user.sub, user = await user_model_default.findById(userId);
  if (!user)
    throw new AppError("User not found", 404);
  let totalJobs = await jobApplication_model_default.countDocuments({ user: userId });
  res.status(200).json({ username: user.username, email: user.email, totalJobs });
};

// routes/profile.routes.js
var profileRouter = import_express3.default.Router();
profileRouter.get("/", authMiddleware_default, profileDetails);
var profile_routes_default = profileRouter;

// middleware/errorHandler.js
var errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500, message = err.message || "Internal Server Error";
  err.name === "JsonWebTokenError" && (statusCode = 403, message = "Forbidden"), err.name === "TokenExpiredError" && (statusCode = 401, message = "Token expired"), process.env.NODE_ENV === "development" ? console.error(err.stack) : console.error(`[Error] ${message}`), res.status(statusCode).json({
    success: !1,
    message,
    ...process.env.NODE_ENV === "development" && { stack: err.stack }
  });
}, errorHandler_default = errorHandler;

// app.js
var import_cookie_parser = __toESM(require("cookie-parser"), 1), import_helmet = __toESM(require("helmet"), 1), import_morgan = __toESM(require("morgan"), 1), import_express_rate_limit = __toESM(require("express-rate-limit"), 1), app = (0, import_express4.default)();
app.use((0, import_helmet.default)());
var allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);
allowedOrigins.length && app.use((0, import_cors.default)({ origin: allowedOrigins, credentials: !0 }));
process.env.NODE_ENV === "development" && app.use((0, import_morgan.default)("dev"));
app.use(import_express4.default.json());
app.use((0, import_cookie_parser.default)());
var limiter = (0, import_express_rate_limit.default)({
  windowMs: 900 * 1e3,
  max: process.env.NODE_ENV === "development" ? 1e3 : 100,
  standardHeaders: !0,
  legacyHeaders: !1
});
app.use("/api/", limiter);
app.use("/api/auth", auth_routes_default);
app.use("/api/jobs", jobApplication_routes_default);
app.use("/api/profile", profile_routes_default);
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});
app.use(errorHandler_default);
var app_default = app;

// server.js
var port = process.env.PORT || 5e3;
connectDB().then(() => {
  app_default.listen(port, () => {
    `${port}`;
  }).on("error", (err) => {
    console.error("Server failed to start", err), process.exit(1);
  });
}).catch((err) => {
  console.error("DB connection failed", err), process.exit(1);
});
