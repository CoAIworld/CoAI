const express = require('express');
const transactionController = require('../controllers/transactionController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

// Routes available to all authenticated users
router.get('/user', transactionController.getUserTransactions);
router.get('/task/:taskId', transactionController.getTaskTransactions);
router.get('/:id', transactionController.getTransaction);

// Routes restricted to admins
router.get('/', restrictTo('admin'), transactionController.getAllTransactions);

module.exports = router; 