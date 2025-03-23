const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTask);

// Protected routes
router.use(protect);

// Task CRUD operations
router.post('/', upload.array('attachments', 5), taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Task applications
router.post('/:id/apply', taskController.applyForTask);
router.post('/:id/applications/:applicationId/accept', taskController.acceptApplication);

module.exports = router; 