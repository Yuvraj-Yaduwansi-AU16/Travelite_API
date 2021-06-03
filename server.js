const hbs = require('hbs');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/error');
const connectDB = require('./db/db');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Route files
const agency = require('./routes/agency');
const tours = require('./routes/tours');
const auth = require('./routes/auth');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const ui = require('./routes/ui');

const app = express();

// Set Template Engine
app.set('view engine', 'hbs');
app.set('views', './templates/views');
hbs.registerPartials('./templates/partials');
hbs.registerHelper('ifnoteq', function (a, b, options) {
  if (a != b) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// Set static folder
app.use(express.static('./public'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Mount routers
app.use('/', ui);
app.use('/agency', agency);
app.use('/tours', tours);
app.use('/auth', auth);
app.use('/reviews', reviews);
app.use('/users', users);

app.use(errorHandler);

app.get('*', (req, res) => {
  res.render('404');
  res.cookie('error', 'empty');
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
