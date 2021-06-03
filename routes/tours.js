const express = require('express');
const {
  getTours,
  getTour,
  addTour,
  updateTour,
  deleteTour,
  bookTour,
  updateTourSeats,
  tourPhotoUpload,
  payment,
} = require('../controllers/tours');

const Tour = require('../models/Tour');

// Include other resource routers
const reviewRouter = require('./reviews');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize, isLoggedIn } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:tourId/reviews', reviewRouter);

router
  .route('/')
  .get(
    isLoggedIn,
    advancedResults(Tour, {
      path: 'agency',
      select: 'name description',
    }),
    getTours
  )
  .post(protect, authorize('organiser', 'admin'), addTour);

router
  .route('/:id/photo')
  .post(protect, authorize('organiser', 'admin'), tourPhotoUpload);

router
  .route('/:id')
  .get(isLoggedIn, getTour)
  .put(protect, authorize('organiser', 'admin'), updateTour)
  .delete(protect, authorize('organiser', 'admin'), deleteTour);

router.route('/:id/enroll').get(protect, authorize('user'), bookTour);

router.route('/:id/seats').put(isLoggedIn, updateTourSeats);

router.post('/:id/payment', protect, payment);

module.exports = router;
