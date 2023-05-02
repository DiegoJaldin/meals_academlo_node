const express = require('express');

const usersControllers = require('../controllers/users.controllers');

const authMiddleware = require('../middleware/auth.middleware');

const orderMiddleware = require('../middleware/orders.middleware');

const routerUsers = express.Router();

routerUsers.post('/signup', usersControllers.registerUser);
routerUsers.post('/login', usersControllers.loginUser);

routerUsers.use(authMiddleware.protect);

routerUsers
  .route('/:id')
  .patch(usersControllers.updateUsers)
  .delete(usersControllers.deleteUsers);

routerUsers.get('/orders', usersControllers.findAllOrders);
routerUsers.get(
  '/orders/:id',
  orderMiddleware.validIfExistOrder,
  usersControllers.findOrderUser
);

module.exports = routerUsers;
