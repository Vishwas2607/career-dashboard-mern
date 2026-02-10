const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode && err.statusCode >= 400
    ? err.statusCode
    : 500;

  let message = err.message || "Internal Server Error";

  if (err.name === "JsonWebTokenError") {
    statusCode = 403;
    message = "Forbidden";
  };

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  };

  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  } else {
    console.error(`[Error] ${message}`);
  };

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),

  });
};

export default errorHandler;
