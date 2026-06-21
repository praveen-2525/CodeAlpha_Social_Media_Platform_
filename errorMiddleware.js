// Middleware to handle 404 (Not Found) routes
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  // If response status code is still 200, default it to 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  
  res.json({
    message: err.message,
    // Provide stack trace in development mode only
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
