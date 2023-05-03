const express = require('express');

const restaurantsControllers = require('../controllers/restaurants.controllers');

const authMiddleware = require('../middleware/auth.middleware');

const restaurantMiddleware = require('../middleware/restaurants.middleware');

const reviewMiddleware = require('../middleware/review.middleware');

const routerRestaurants = express.Router();

routerRestaurants.use(authMiddleware.protect);

routerRestaurants
  .route('/')
  .get(restaurantsControllers.findAllRestaurant)
  .post(
    authMiddleware.restrictTo('admin'),
    restaurantsControllers.createRestaurant
  );
routerRestaurants
  .route('/:id')
  .get(restaurantsControllers.findOneRestaurant)
  .patch(
    restaurantMiddleware.validExistRestaurant,
    authMiddleware.restrictTo('admin'),
    restaurantsControllers.updateRestaurant
  )
  .delete(
    restaurantMiddleware.validExistRestaurant,
    authMiddleware.restrictTo('admin'),
    restaurantsControllers.deleteRestaurants
  );
routerRestaurants
  .route('/reviews/:id')
  .post(
    restaurantMiddleware.validExistRestaurant,
    restaurantsControllers.createReview
  );
routerRestaurants
  .route('/reviews/:restaurantId/:id')
  .patch(
    reviewMiddleware.validIfExistReview,
    restaurantsControllers.updateReview
  )
  .delete(
    reviewMiddleware.validIfExistReview,
    restaurantsControllers.deleteReview
  );

module.exports = routerRestaurants;
