const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/user/:userId', feedbackController.getUserFeedback);
router.get('/task/:taskId', feedbackController.getTaskFeedback);

// Protected routes
router.use(protect);

// Create feedback
router.post('/', feedbackController.createFeedback);

module.exports = router; 