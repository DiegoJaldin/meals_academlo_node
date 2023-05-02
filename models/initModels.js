const MealModel = require('./meals.models');
const UserModel = require('./users.models');
const OrderModel = require('./orders.models');
const RestaurantModel = require('./restaurants.models');
const ReviewModel = require('./reviews.models');


const initModel = () => {
  RestaurantModel.hasMany(MealModel)
  MealModel.belongsTo(RestaurantModel)

  MealModel.hasOne(OrderModel)
  OrderModel.belongsTo(MealModel)

  UserModel.hasMany(OrderModel)
  OrderModel.belongsTo(UserModel)

  UserModel.hasMany(ReviewModel)
  ReviewModel.belongsTo(UserModel)

  RestaurantModel.hasMany(ReviewModel)
  ReviewModel.belongsTo(RestaurantModel)
};


module.exports = initModel;