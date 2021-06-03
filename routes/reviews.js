const express = require('express');
const { addReview, deleteReview } = require('../controllers/reviews');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.post('/', protect, authorize('user', 'admin'), addReview);
router.delete('/:id', protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
