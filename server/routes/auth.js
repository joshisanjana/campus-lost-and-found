const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  authUser, 
  getUserProfile, 
  verifyEmail,
  resendVerification 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.route('/register').post(registerUser);
router.route('/login').post(authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/verify-email').get(verifyEmail);
router.route('/resend-verification').post(resendVerification);

module.exports = router;
