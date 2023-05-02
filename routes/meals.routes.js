const express = require('express');

const mealsControllers = require('../controllers/meals.controllers');

const authMiddleware = require('../middleware/auth.middleware');

const mealMiddleware = require('../middleware/meals.middleware');

const restaurantMiddleware = require('../middleware/restaurants.middleware');

const routerMeals = express.Router();

routerMeals.get('/', mealsControllers.findAllMeal);
routerMeals.get('/:id', mealsControllers.findMealUser);

routerMeals.use(authMiddleware.protect);

routerMeals.route('/');

routerMeals
  .route('/:id')
  .post(restaurantMiddleware.validExistRestaurant, mealsControllers.createMeal)
  .patch(mealMiddleware.validExistMeal, mealsControllers.updateMeals)
  .delete(mealMiddleware.validExistMeal, mealsControllers.deleteMeal);

module.exports = routerMeals;
