const Review = require('../models/reviews.models');
const catchAsync = require('../utils/catchAsync');
const Restaurant = require('../models/restaurants.models');
const AppError = require('../utils/appError');

exports.createRestaurant = catchAsync(async (req, res) => {
  const { name, address, rating } = req.body;

  const restaurants = await Restaurant.create({
    name,
    address,
    rating,
  });

  res.status(201).json({
    status: 'success',
    message: 'The restaurant has been created',
    restaurants,
  });
});

exports.findAllRestaurant = catchAsync(async (req, res) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: 'active',
    },

    include: [
      {
        model: Review,
      },
    ],
  });

  res.status(200).json({
    message: 'The restaurant has been done successfully',
    results: restaurants.length,
    restaurants,
  });
});

exports.findOneRestaurant = catchAsync(async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findOne({
    where: {
      id,
    },

    include: [
      {
        model: Review,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res) => {
  const { name, address } = req.body;
  const { restaurants } = req;

  await restaurants.update({
    name,
    address,
  });

  res.status(200).json({
    status: 'success',
    message: 'The restaurant has been updated',
  });
});

exports.deleteRestaurants = catchAsync(async (req, res) => {
  const { restaurants } = req;

  await restaurants.update({
    status: 'disabled',
  });
  res.status(200).json({
    message: 'This restaurant has been deleted',
  });
});

// Review

exports.createReview = catchAsync(async (req, res) => {
  const { comment, rating } = req.body;
  const { sessionUser, restaurants } = req;

  const reviews = await Review.create({
    userId: sessionUser.id,
    restaurantId: restaurants.id,
    comment,
    rating,
  });

  res.status(201).json({
    status: 'success',
    message: 'The review has been created',
    reviews,
  });
});

exports.updateReview = catchAsync(async (req, res) => {
  const { comment, rating } = req.body;
  const { restaurantId, id } = req.params;
  const { sessionUser } = req;
  const reviews = await Review.findOne({
    where: {
      id,
      restaurantId,
      status: 'active',
    },
  });
  if (!reviews) {
    return next(new AppError(`Review with id ${id} not found`, 404));
  }
  if (reviews.userId !== sessionUser.id) {
    return next(
      new AppError('You are not authorized to update this review', 401)
    );
  }

  await Review.update({ comment, rating });

  res.status(200).json({
    status: 'success',
    message: 'Review has been updated',
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const reviews = await Review.findOne({
    id,
    status: 'active',
  });

  await Review.update({
    status: 'deleted',
  });

  res.status(200).json({
    message: 'This review has been deleted',
    reviews,
  });
});
