const express = require('express');

const ordersControllers = require('../controllers/orders.controllers');

const authMiddleware = require('../middleware/auth.middleware');

const orderMiddleware = require('../middleware/orders.middleware');

const routerOrders = express.Router();

routerOrders.use(authMiddleware.protect);

routerOrders.route('/').post(ordersControllers.createOrder);
routerOrders.route('/me').get(ordersControllers.findAllOrder);
routerOrders
  .route('/:id')
  .patch(orderMiddleware.validIfExistOrder, ordersControllers.updateOrder)
  .delete(orderMiddleware.validIfExistOrder, ordersControllers.deleteOrder);

module.exports = routerOrders;
