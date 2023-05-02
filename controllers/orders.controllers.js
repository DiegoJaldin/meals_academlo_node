const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Order = require('../models/orders.models');
const Meal = require('../models/meals.models');
const Restaurant = require('../models/restaurants.models');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { sessionUser } = req;

  const meal = await Meal.findOne({
    where: {
      id: mealId,
      status: 'active',
    },
  });

  if (!meal) {
    return next(new AppError('Meal not found', 404));
  }

  const totalPrice = quantity * meal.price;
  const orders = await Order.create({
    mealId,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    message: 'The order has been created successfully',
    orders,
  });
});

exports.findAllOrder = catchAsync(async (req, res) => {
  const orders = await Order.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: Meal,
        icnlude: [Restaurant],
      },
    ],
  });

  res.status(200).json({
    message: 'The order does exist',
    orders,
  });
});

exports.updateOrder = catchAsync(async (req, res) => {
  const { order } = req;

  await order.update({
    status: 'completed',
  });

  res.status(200).json({
    status: 'success',
    message: 'The order has been updated',
  });
});

exports.deleteOrder = catchAsync(async (req, res) => {
  const { order } = req;

  await order.update({
    status: 'disabled',
  });
  res.status(200).json({
    message: 'This order has been deleted',
  });
});
