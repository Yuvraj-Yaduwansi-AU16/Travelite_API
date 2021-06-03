const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  error.page = err.page;

  console.log(err);

  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404, '/');
  }

  if (err.code === 11000) {
    const message = 'You can only review a tour once';
    error = new ErrorResponse(message, 400, '/tours');
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400, '/login');
  }

  res.cookie('error', `${error.message}`);
  req.method = 'GET';
  if (err.redirectstatus === 302) {
    res.redirect(200, `${error.page}`);
  } else {
    res.redirect(`${error.page}`);
  }
};

module.exports = errorHandler;
