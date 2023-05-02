const Meal = require('../models/meals.models');
const Order = require('../models/orders.models');
const Restaurant = require('../models/restaurants.models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validIfExistOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findOne({
    where: {
      id,
    },
    include: [
      {
        model: Meal,
        include: [Restaurant],
      },
    ],
  });
  if (!order) {
    return next(new AppError(`Order with this ID doesn't exist.`, 404));
  }
  if (order.status === 'completed') {
    return next(new AppError('Order has been delivered', 404));
  }
  if (order.status === 'cancelled') {
    return next(new AppError('Order is cancelled', 404));
  }
  req.order = order;
  next();
});
