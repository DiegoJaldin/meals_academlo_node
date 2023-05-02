const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const routerRestaurant = require('./routes/restaurants.routes');
const routerUser = require('./routes/users.routes');
const routerOrder = require('./routes/orders.routes');
const routerMeal = require('./routes/meals.routes');

const app = express();

app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/v1/users', routerUser);
app.use('/api/v1/meals', routerMeal);
app.use('/api/v1/restaurants', routerRestaurant);
app.use('/api/v1/orders', routerOrder);

module.exports = app;
