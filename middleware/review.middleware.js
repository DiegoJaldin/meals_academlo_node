const Review = require('../models/reviews.models');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.validIfExistReview = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;
  const { sessionUser } = req;
  const review = await Review.findOne({
    where: {
      id,
      restaurantId,
    },
  });
  if (review.userId !== sessionUser.id) {
    return next(
      new AppError('You are not authorized to update this review', 401)
    );
  }
  req.review = review;
  next();
});
