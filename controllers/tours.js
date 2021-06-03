const path = require('path');
const stripe = require('stripe')(process.env.SECRET_KEY);
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Tour = require('../models/Tour');
const User = require('../models/User');
const Agency = require('../models/Agency');

// GET /agency/:agencyID/tours
exports.getTours = asyncHandler(async (req, res, next) => {
  const tours = res.advancedResults.data;
  if (req.user) {
    const username = req.user.name;
    const userrole = req.user.role;
    const id = req.user._id;
    return res.render('all_tours', { tours, username, userrole, id });
  }

  res.render('all_tours', { tours });
});

// GET /tours/:id
exports.getTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(
      new ErrorResponse(`No tour with the id of ${req.params.id}`, 404, `/`)
    );
  }

  let error;
  if (req.cookies.error) {
    error = req.cookies.error;
  }

  if (req.user) {
    const id = req.user._id;
    const userid = req.user._id;
    const username = req.user.name;
    const userrole = req.user.role;
    if (userrole === 'organiser') {
      res.render('tour', { error, tour, username, userid, id });
      return res.cookie('error', 'empty');
    }
    res.render('tour', { error, tour, username, userrole, userid, id });
    return res.cookie('error', 'empty');
  }

  res.render('tour', { error, tour });
  res.cookie('error', 'empty');
});

// POST /agency/:agencyID/tours
exports.addTour = asyncHandler(async (req, res, next) => {
  req.body.agency = req.params.agencyID;
  req.body.user = req.user.id;

  const agency = await Agency.findById(req.params.agencyID);

  if (!agency) {
    return next(
      new ErrorResponse(
        `No agency with the id of ${req.params.agencyID}`,
        404,
        `/agency/${req.params.agencyID}`
      )
    );
  }

  if (agency.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a tour to agency ${agency._id}`,
        401,
        `/agency/${req.params.agencyID}`
      )
    );
  }

  const tour = new Tour(req.body);
  await tour.save();

  res.redirect(`/tours/${tour._id}`);
});

// PUT /tours/:id
exports.updateTour = asyncHandler(async (req, res, next) => {
  let tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new ErrorResponse(
        `No tour with the id of ${req.params.id}`,
        404,
        `/tours/${req.params.id}`,
        302
      )
    );
  }

  if (tour.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update tour ${tour._id}`,
        401,
        `/tours/${req.params.id}`,
        302
      )
    );
  }

  for (let key in req.body) {
    if (req.body[key] === '') req.body[key] = tour[key];
  }

  tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await tour.save();

  res.status(200).send();
});

// DELETE /tours/:id
exports.deleteTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new ErrorResponse(
        `No tour with the id of ${req.params.id}`,
        404,
        `/tours/${req.params.id}`,
        302
      )
    );
  }

  if (tour.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete tour ${tour._id}`,
        401,
        `/tours/${req.params.id}`,
        302
      )
    );
  }

  await tour.remove();

  res.status(200).send();
});

// POST /tours/:id/photo
exports.tourPhotoUpload = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new ErrorResponse(
        `tour not found with id of ${req.params.id}`,
        404,
        `/tours/${req.params.id}`
      )
    );
  }

  if (tour.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this tour`,
        401,
        `/tours/${req.params.id}`
      )
    );
  }

  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400, `/tours/${req.params.id}`)
    );
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(
        `Please upload an image file`,
        400,
        `/tours/${req.params.id}`
      )
    );
  }

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${
          process.env.MAX_FILE_UPLOAD / 1000000
        } MB`,
        400,
        `/tours/${req.params.id}`
      )
    );
  }

  file.name = `photo_${tour._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(
          `Problem with file upload`,
          500,
          `/tours/${req.params.id}`
        )
      );
    }

    await Tour.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.redirect(`/tours/${req.params.id}`);
  });
});

// GET /tours/:id/enroll
exports.bookTour = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new ErrorResponse(`No tour with the id of ${req.params.id}`, 404, `/`)
    );
  }

  let error;
  if (req.cookies.error) {
    error = req.cookies.error;
  }

  if (req.user) {
    const key = process.env.PUBLISHABLE_KEY;
    const id = req.user._id;
    const userid = req.user._id;
    const username = req.user.name;
    const userrole = req.user.role;
    if (userrole === 'organiser') {
      res.render('confirmation', { error, tour, username, userid, id, key });
      return res.cookie('error', 'empty');
    }
    res.render('confirmation', {
      error,
      tour,
      username,
      userrole,
      userid,
      id,
      key,
    });
    return res.cookie('error', 'empty');
  }

  res.render('confirmation', { error, tour, key });
  res.cookie('error', 'empty');
});

// PUT /tours/:id/seats
exports.updateTourSeats = asyncHandler(async (req, res, next) => {
  let tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(
      new ErrorResponse(
        `No tour with the id of ${req.params.id}`,
        404,
        `/tours/${req.params.id}`,
        302
      )
    );
  }

  for (let key in req.body) {
    if (req.body[key] === '') req.body[key] = tour[key];
  }

  tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await tour.save();

  res.status(200).send();
});

// POST /tours/id/payment
exports.payment = asyncHandler(async (req, res, next) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: 'Yuvraj Singh',
      address: {
        line1: 'TC 9/4 Old MES colony',
        postal_code: '226101',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        country: 'India',
      },
    });

    await stripe.charges.create({
      amount: 1000,
      description: 'Web Development Product',
      currency: 'INR',
      customer: customer.id,
    });

    const tour = await Tour.findById(req.params.id);
    tour.seats -= 1;
    tour.save();

    const user = await User.findById(req.user._id);
    user.myTours.push({ tourId: req.params.id });
    await user.save();

    res.redirect(`/users/${req.user.id}`);
  } catch (err) {
    return next(
      new ErrorResponse(`${err.message}`, 400, `/users/${req.user.id}`)
    );
  }
});
