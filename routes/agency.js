const express = require('express');
const {
  getAgencies,
  getAgency,
  createAgency,
  updateAgency,
  deleteAgency,
  agencyPhotoUpload,
} = require('../controllers/agency');

const Agency = require('../models/Agency');

// Include other resource routers
const toursRouter = require('./tours');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize, isLoggedIn } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:agencyID/tours', toursRouter);

router
  .route('/:id/photo')
  .post(protect, authorize('organiser', 'admin'), agencyPhotoUpload);

router
  .route('/')
  .get(isLoggedIn, advancedResults(Agency, 'tours'), getAgencies)
  .post(protect, authorize('organiser', 'admin'), createAgency);

router
  .route('/:id')
  .get(isLoggedIn, getAgency)
  .put(protect, authorize('organiser', 'admin'), updateAgency)
  .delete(protect, authorize('organiser', 'admin'), deleteAgency);

module.exports = router;
