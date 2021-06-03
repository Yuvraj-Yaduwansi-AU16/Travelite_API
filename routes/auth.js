const express = require('express');
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', protect, logout);

module.exports = router;
