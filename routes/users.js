const express = require('express');
const { getUser, deleteUser, deleteTour } = require('../controllers/users');

const router = express.Router({ mergeParams: true });

const { protect, isLoggedIn } = require('../middleware/auth');

router.route('/:id').get(protect, getUser).delete(protect, deleteUser);

router.route('/:id/deleteTour').put(isLoggedIn, deleteTour);

module.exports = router;
