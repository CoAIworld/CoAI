const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Get nonce for wallet authentication
router.get('/nonce/:walletAddress', authController.getNonce);

// Verify wallet signature
router.post('/verify', authController.verifySignature);

// Get authenticated user
router.get('/me', protect, authController.getMe);

// Logout
router.post('/logout', protect, authController.logout);

module.exports = router; 