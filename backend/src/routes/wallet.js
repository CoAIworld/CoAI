const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/balance/:walletAddress', walletController.getWalletBalance);
router.get('/token-balance/:walletAddress', walletController.getTokenBalance);

// Protected routes
router.use(protect);

// Escrow and payment routes
router.post('/escrow/:taskId', walletController.createEscrow);
router.post('/release-payment/:taskId', walletController.releasePayment);

module.exports = router; 