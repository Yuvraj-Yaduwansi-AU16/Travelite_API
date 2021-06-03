const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Tour = require('../models/Tour');

//  POST /tour/:tourId/reviews
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.tour = req.params.tourId;
  req.body.user = req.user.id;
  req.body.username = req.user.name;

  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(
      new ErrorResponse(
        `No Tour with the id of ${req.params.tourId}`,
        404,
        `/tours/${req.body.tour}`
      )
    );
  }

  const review = new Review(req.body);
  await review.save();

  res.redirect(`/tours/${req.body.tour}`);
});

//  DELETE /reviews/:id
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404, '/')
    );
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401, '/'));
  }

  await review.remove();

  res.status(200).send();
});
