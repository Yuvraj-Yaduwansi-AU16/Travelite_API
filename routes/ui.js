const express = require('express');
const { homeUI, loginUI, signupUI, newAgencyUI } = require('../controllers/ui');
const { isLoggedIn, authorize, protect } = require('../middleware/auth');

const toursRouter = require('./tours');

const router = express.Router();

router.use('newtour/tours', toursRouter);

router.get('/', isLoggedIn, homeUI);
router.get('/login', isLoggedIn, loginUI);
router.get('/signup', isLoggedIn, signupUI);
router.get('/newagency', protect, authorize('organiser', 'admin'), newAgencyUI);

module.exports = router;
