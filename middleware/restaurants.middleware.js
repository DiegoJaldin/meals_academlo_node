const Restaurant = require('../models/restaurants.models');
const catchAsync = require('../utils/catchAsync');

exports.validExistRestaurant = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const restaurants = await Restaurant.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!restaurants) {
    return res.status(404).json({
      status: 'error',
      message: 'the restaurant not found',
    });
  }
  req.restaurants = restaurants;
  next();
});
