const Meal = require('../models/meals.models');
const catchAsync = require('../utils/catchAsync');

exports.validExistMeal = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meals = await Meal.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!meals) {
    return res.status(404).json({
      status: 'error',
      message: 'the meal is not found',
    });
  }
  req.meals = meals;
  next();
});
