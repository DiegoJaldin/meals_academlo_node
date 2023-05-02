const catchAsync = require('../utils/catchAsync');
const Meal = require('../models/meals.models');
const Restaurant = require('../models/restaurants.models');

exports.createMeal = catchAsync(async (req, res) => {
  const { name, price } = req.body;
  const { restaurants } = req;

  const meals = await Meal.create({
    name,
    price,
    restaurantId: restaurants.id,
  });

  res.status(201).json({
    status: 'success',
    message: 'The meal has been created successfully',
    meals,
  });
});

exports.findAllMeal = catchAsync(async (req, res) => {
  const meals = await Meal.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        Restaurant,
      },
    ],
  });

  res.status(200).json({
    message: 'The meal that you ordered exist',
    meals,
  });
});

exports.findMealUser = catchAsync(async (req, res) => {
  const { user } = req;

  const { meals } = req;

  await Meal.findOne({
    where: {
      userId: user.id,
    },
  });

  res.status(200).json({
    status: 'success',
    meals,
  });
});

exports.updateMeals = catchAsync(async (req, res) => {
  const { name, price } = req.body;
  const { meals } = req;

  await meals.update({
    name,
    price,
  });

  res.status(200).json({
    status: 'success',
    message: 'The meal has been updated',
  });
});

exports.deleteMeal = catchAsync(async (req, res) => {
  const { meals } = req;

  await meals.update({
    status: 'disabled',
  });
  res.status(200).json({
    message: 'This meal has been deleted',
  });
});
