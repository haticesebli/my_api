const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/users');

//Connect MongoDB with mongoose.connect()
mongoose.connect('Put the connection key here, get it from MongoDB Atlas Page', {
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
// After upload an image, when we want to access it, we'll call localhost:3000/uploads so accessing to the /uploads should be activated!
// app.use('/uploads' + express.static('uploads'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type,Accept,Authorization");
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST , PATCH, DELETE ,GET');
    return res.status(200).json({});
  }
  //for other routes
  next();
});
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;
