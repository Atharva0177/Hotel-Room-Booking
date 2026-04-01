const errorHandler = (error, _req, res, _next) => {
  const status = error.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors || [],
  });
};

module.exports = errorHandler;
