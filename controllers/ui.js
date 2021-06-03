const asyncHandler = require('../middleware/async');
const Agency = require('../models/Agency');
const Tour = require('../models/Tour');

// GET /
exports.homeUI = asyncHandler(async (req, res, next) => {
  let agency = await Agency.find();
  agency = agency.slice(0, 4);

  let tours = await Tour.find().sort('daysleft');
  tours = tours.slice(0, 4);

  let data = { agency, tours };

  if (req.cookies.error) {
    data.error = req.cookies.error;
  } else {
    data.error = 'empty';
  }

  if (req.user) {
    data.username = req.user.name;
    data.id = req.user._id;
    if (req.user.role === 'organiser' || req.user.role === 'admin') {
      data.userrole = req.user.role;
    }
  }

  res.render('home', data);
  res.cookie('error', 'empty');
});

// GET /login
exports.loginUI = asyncHandler(async (req, res, next) => {
  let error;
  if (req.cookies.error) {
    error = req.cookies.error;
  }
  if (req.user) {
    return res.redirect('/');
  }
  res.render('login', { error });
  res.cookie('error', 'empty');
});

// GET /signup
exports.signupUI = asyncHandler(async (req, res, next) => {
  let error;
  if (req.cookies.error) {
    error = req.cookies.error;
  }
  if (req.user) {
    return res.redirect('/');
  }
  res.render('signup', { error });
  res.cookie('error', 'empty');
});

// GET /newagency
exports.newAgencyUI = asyncHandler(async (req, res, next) => {
  const data = {
    id: req.user._id,
    username: req.user.name,
    userrole: req.user.role,
  };

  if (req.cookies.error) {
    data.error = req.cookies.error;
  }

  res.render('new_agency', data);
  res.cookie('error', 'empty');
});
