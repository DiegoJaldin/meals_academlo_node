const User = require('../models/users.models');
const catchAsync = require('../utils/catchAsync');
const bcryptjs = require('bcryptjs');
const AppError = require('../utils/appError');
const Order = require('../models/orders.models');
const Meal = require('../models/meals.models');
const Restaurant = require('../models/restaurants.models');
const generateJWT = require('../utils/jwt');

exports.registerUser = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const salt = await bcryptjs.genSalt(10);

  const encryptedPassword = await bcryptjs.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: encryptedPassword,
    role,
  });

  const token = await generateJWT(user.id);

  res.status(201).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });

  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }

  if (!(await bcryptjs.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.updateUsers = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  const { sessionUser } = req;

  await sessionUser.update({
    name,
    email,
  });

  res.status(200).json({
    status: 'success',
    message: 'The user has been updated',
  });
});

exports.deleteUsers = catchAsync(async (req, res) => {
  const { sessionUser } = req;

  await sessionUser.update({
    status: 'disabled',
  });
  res.status(200).json({
    message: 'This user has been deleted',
  });
});

exports.findAllOrders = catchAsync(async (req, res) => {
  const userId = req.sessionUser.id;
  console.log(userId);
  const orders = await Order.findAll({
    where: {
      userId: userId,
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
    message: 'The order has been requested successfully',
    results: orders.length,
    orders,
  });
});

exports.findOrderUser = catchAsync(async (req, res) => {
  const { user } = req;

  const { order } = req;

  await Order.findOne({
    where: {
      userId: user.id,
    },
  });

  res.status(200).json({
    status: 'success',
    order,
  });
});
