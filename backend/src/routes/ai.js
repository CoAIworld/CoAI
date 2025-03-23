const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// All AI routes require authentication
router.use(protect);

// AI suggestion routes
router.post('/suggestions', aiController.getTaskSuggestions);
router.post('/contribute/:taskId', aiController.contributeToTask);
router.get('/skill-recommendations', aiController.getSkillRecommendations);

module.exports = router; 