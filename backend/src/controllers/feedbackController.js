const Feedback = require('../models/Feedback');
const Task = require('../models/Task');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// @desc    Create a new feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = catchAsync(async (req, res, next) => {
  // Get data from request body
  const { taskId, receiverId, rating, comment, skillRatings } = req.body;
  
  // Check if task exists and is completed
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new AppError('Task not found', 404));
  }
  
  if (task.status !== 'completed') {
    return next(new AppError('You can only leave feedback for completed tasks', 400));
  }
  
  // Check if the user is involved in the task
  const isCreator = task.creator.toString() === req.user.id.toString();
  const isAssignee = task.assignedTo && task.assignedTo.toString() === req.user.id.toString();
  
  if (!isCreator && !isAssignee) {
    return next(new AppError('You are not authorized to leave feedback for this task', 403));
  }
  
  // Make sure the receiver is also involved in the task
  if (receiverId.toString() !== task.creator.toString() && 
      (!task.assignedTo || receiverId.toString() !== task.assignedTo.toString())) {
    return next(new AppError('Receiver must be involved in the task', 400));
  }
  
  // Make sure users cannot leave feedback for themselves
  if (receiverId.toString() === req.user.id.toString()) {
    return next(new AppError('You cannot leave feedback for yourself', 400));
  }
  
  // Check if feedback already exists
  const existingFeedback = await Feedback.findOne({
    task: taskId,
    sender: req.user.id,
    receiver: receiverId
  });
  
  if (existingFeedback) {
    return next(new AppError('You have already left feedback for this task', 400));
  }
  
  // Create feedback
  const feedback = await Feedback.create({
    task: taskId,
    sender: req.user.id,
    receiver: receiverId,
    rating,
    comment,
    skillRatings
  });
  
  // Update user's average rating
  const allFeedback = await Feedback.find({ receiver: receiverId });
  const totalRating = allFeedback.reduce((sum, fb) => sum + fb.rating, 0);
  const averageRating = totalRating / allFeedback.length;
  
  // Update user with new average rating
  await User.findByIdAndUpdate(receiverId, { 
    reputation: averageRating.toFixed(1) 
  });
  
  // For each skill rating, update the user's skills
  if (skillRatings && skillRatings.length > 0) {
    const receiver = await User.findById(receiverId);
    
    for (const { skill, rating } of skillRatings) {
      // Find if user already has this skill
      const existingSkill = receiver.skills.find(s => s.name === skill);
      
      if (existingSkill) {
        // Update existing skill with new rating average
        const newRatingCount = existingSkill.ratingCount + 1;
        const newRatingValue = ((existingSkill.rating * existingSkill.ratingCount) + rating) / newRatingCount;
        
        existingSkill.rating = newRatingValue.toFixed(1);
        existingSkill.ratingCount = newRatingCount;
      } else {
        // Add new skill
        receiver.skills.push({
          name: skill,
          rating: rating,
          ratingCount: 1
        });
      }
    }
    
    // Save the updated user
    await receiver.save();
  }
  
  res.status(201).json({
    status: 'success',
    data: {
      feedback
    }
  });
});

// @desc    Get all feedback for a user
// @route   GET /api/feedback/user/:userId
// @access  Public
exports.getUserFeedback = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;
  
  // Check if user exists
  const userExists = await User.exists({ _id: userId });
  if (!userExists) {
    return next(new AppError('User not found', 404));
  }
  
  // Get feedback where user is receiver
  const feedback = await Feedback.find({ receiver: userId })
    .sort('-createdAt')
    .populate({
      path: 'sender',
      select: 'name avatar reputation'
    })
    .populate({
      path: 'task',
      select: 'title'
    });
  
  res.status(200).json({
    status: 'success',
    results: feedback.length,
    data: {
      feedback
    }
  });
});

// @desc    Get feedback for a task
// @route   GET /api/feedback/task/:taskId
// @access  Public
exports.getTaskFeedback = catchAsync(async (req, res, next) => {
  const taskId = req.params.taskId;
  
  // Check if task exists
  const taskExists = await Task.exists({ _id: taskId });
  if (!taskExists) {
    return next(new AppError('Task not found', 404));
  }
  
  // Get all feedback for this task
  const feedback = await Feedback.find({ task: taskId })
    .populate({
      path: 'sender',
      select: 'name avatar reputation'
    })
    .populate({
      path: 'receiver',
      select: 'name avatar reputation'
    });
  
  res.status(200).json({
    status: 'success',
    results: feedback.length,
    data: {
      feedback
    }
  });
}); 