const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/:id', userController.getUser);
router.get('/wallet/:walletAddress', userController.getUserByWalletAddress);

// Protected routes
router.use(protect);

// Profile routes
router.put('/profile', upload.single('profilePicture'), userController.updateProfile);

// Skills routes
router.post('/skills', userController.addSkill);
router.put('/skills/:skillId', userController.updateSkill);
router.delete('/skills/:skillId', userController.deleteSkill);

// User tasks and applications
router.get('/tasks', userController.getUserTasks);
router.get('/applications', userController.getUserApplications);
router.get('/balance', userController.getUserBalance);

// Admin routes
router.use(restrictTo('admin'));
router.get('/', userController.getAllUsers);

module.exports = router; 