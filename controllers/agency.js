const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Agency = require('../models/Agency');

// GET /agency
exports.getAgencies = asyncHandler(async (req, res, next) => {
  const agencies = res.advancedResults.data;

  if (req.user) {
    const username = req.user.name;
    const userrole = req.user.role;
    const id = req.user._id;
    return res.render('all_agencies', { agencies, username, userrole, id });
  }

  res.render('all_agencies', { agencies });
});

// GET /agency/:id
exports.getAgency = asyncHandler(async (req, res, next) => {
  const agency = await Agency.findById(req.params.id).populate('tours');

  if (!agency) {
    return next(
      new ErrorResponse(
        `agency not found with id of ${req.params.id}`,
        404,
        `/agency/:${req.params.id}`
      )
    );
  }

  let error;
  if (req.cookies.error) {
    error = req.cookies.error;
  } else {
    error = 'empty';
  }

  if (req.user) {
    const id = req.user._id;
    const username = req.user.name;
    const userrole = req.user.role;
    res.render('agency', { error, agency, username, userrole, id });
    return res.cookie('error', 'empty');
  }

  res.render('agency', { error, agency });
  res.cookie('error', 'empty');
});

// POST /agency
exports.createAgency = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const publishedAgency = await Agency.findOne({ user: req.user.id });

  if (publishedAgency && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already published a agency`,
        400,
        `/`
      )
    );
  }

  const agency = await Agency.create(req.body);

  res.redirect(`/agency/${agency._id}`);
});

// PUT /agency/:id
exports.updateAgency = asyncHandler(async (req, res, next) => {
  let agency = await Agency.findById(req.params.id);

  if (!agency) {
    return next(
      new ErrorResponse(
        `agency not found with id of ${req.params.id}`,
        404,
        `/agency/${req.params.id}`,
        302
      )
    );
  }

  if (agency.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this agency`,
        401,
        `/agency/${req.params.id}`,
        302
      )
    );
  }

  for (let key in req.body) {
    if (req.body[key] === '') req.body[key] = agency[key];
  }

  agency = await Agency.findByIdAndUpdate(agency._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).send();
});

// DELETE /agency/:id
exports.deleteAgency = asyncHandler(async (req, res, next) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    return next(
      new ErrorResponse(
        `agency not found with id of ${req.params.id}`,
        401,
        `/agency/${req.params.id}`,
        302
      )
    );
  }

  if (agency.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this agency`,
        401,
        `/agency/${req.params.id}`,
        302
      )
    );
  }
  agency.remove();
  res.status(200).send();
});

// POST /agency/:id/photo
exports.agencyPhotoUpload = asyncHandler(async (req, res, next) => {
  const agency = await Agency.findById(req.params.id);

  if (!agency) {
    return next(
      new ErrorResponse(
        `agency not found with id of ${req.params.id}`,
        404,
        `/agency/${req.params.id}`
      )
    );
  }

  if (agency.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this agency`,
        401,
        `/agency/${req.params.id}`
      )
    );
  }

  if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400, `/agency/${req.params.id}`)
    );
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(
        `Please upload an image file`,
        400,
        `/agency/${req.params.id}`
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
        `/agency/${req.params.id}`
      )
    );
  }

  file.name = `photo_${agency._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(
        new ErrorResponse(
          `Problem with file upload`,
          500,
          `/agency/${req.params.id}`
        )
      );
    }

    await Agency.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.redirect(`/agency/${req.params.id}`);
  });
});
