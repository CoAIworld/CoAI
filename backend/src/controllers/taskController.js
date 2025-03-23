const Task = require('../models/Task');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const openai = require('../services/openai');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
exports.getAllTasks = catchAsync(async (req, res, next) => {
  // Build query
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);
  
  // Filter by status
  if (queryObj.status) {
    queryObj.status = queryObj.status;
  }
  
  // Filter by category
  if (queryObj.category) {
    queryObj.category = queryObj.category;
  }
  
  // Filter by skills
  if (queryObj.skills) {
    queryObj.requiredSkills = { $in: queryObj.skills.split(',') };
    delete queryObj.skills;
  }
  
  // Search by keyword
  if (queryObj.keyword) {
    queryObj.$text = { $search: queryObj.keyword };
    delete queryObj.keyword;
  }
  
  // Execute query
  let query = Task.find(queryObj);
  
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  
  // Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(',').join(' ');
    query = query.select(fields);
  } else {
    query = query.select('-__v');
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  query = query.skip(startIndex).limit(limit);
  
  // Execute query with creator populated
  const tasks = await query.populate({
    path: 'creator',
    select: 'name walletAddress reputation'
  });
  
  // Count total tasks for pagination
  const total = await Task.countDocuments(queryObj);
  
  res.status(200).json({
    status: 'success',
    results: tasks.length,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    },
    data: {
      tasks
    }
  });
});

// @desc    Get a single task
// @route   GET /api/tasks/:id
// @access  Public
exports.getTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate({
      path: 'creator',
      select: 'name walletAddress reputation'
    })
    .populate({
      path: 'assignedTo',
      select: 'name walletAddress reputation'
    })
    .populate({
      path: 'applications.applicant',
      select: 'name walletAddress reputation'
    });
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = catchAsync(async (req, res, next) => {
  // Add creator to task
  req.body.creator = req.user.id;
  
  // Get AI suggestions if AI assistance is enabled
  if (req.body.aiAssistanceLevel !== 'Low') {
    try {
      const aiSuggestions = await getAISuggestions(req.body);
      req.body.aiContributions = aiSuggestions.map(suggestion => ({
        suggestion,
        category: 'recommendation'
      }));
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Continue without AI suggestions if there's an error
    }
  }
  
  // Create task
  const task = await Task.create(req.body);
  
  // Update user's totalTasksCreated count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { totalTasksCreated: 1 }
  });
  
  res.status(201).json({
    status: 'success',
    data: {
      task
    }
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if user is the creator of the task
  if (task.creator.toString() !== req.user.id.toString()) {
    return next(new AppError('You are not authorized to update this task', 403));
  }
  
  // Don't allow updates to certain fields once the task is assigned
  if (task.status !== 'open' && task.status !== 'draft') {
    const restrictedFields = ['price', 'requiredSkills', 'deadline'];
    const attemptingToUpdate = Object.keys(req.body).some(field => restrictedFields.includes(field));
    
    if (attemptingToUpdate) {
      return next(new AppError('Cannot update task details after it has been assigned', 400));
    }
  }
  
  // Update task
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate({
    path: 'creator',
    select: 'name walletAddress reputation'
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      task: updatedTask
    }
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if user is the creator of the task
  if (task.creator.toString() !== req.user.id.toString()) {
    return next(new AppError('You are not authorized to delete this task', 403));
  }
  
  // Only allow deletion if the task is in draft or open status
  if (task.status !== 'open' && task.status !== 'draft') {
    return next(new AppError('Cannot delete a task that has been assigned or is in progress', 400));
  }
  
  // Delete task
  await task.remove();
  
  // Update user's totalTasksCreated count
  await User.findByIdAndUpdate(req.user.id, {
    $inc: { totalTasksCreated: -1 }
  });
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

// @desc    Apply for a task
// @route   POST /api/tasks/:id/apply
// @access  Private
exports.applyForTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if task is open for applications
  if (task.status !== 'open') {
    return next(new AppError('This task is not open for applications', 400));
  }
  
  // Check if user is the creator (creators cannot apply to their own tasks)
  if (task.creator.toString() === req.user.id.toString()) {
    return next(new AppError('You cannot apply to your own task', 400));
  }
  
  // Check if user has already applied
  const hasApplied = task.applications.some(app => 
    app.applicant.toString() === req.user.id.toString()
  );
  
  if (hasApplied) {
    return next(new AppError('You have already applied to this task', 400));
  }
  
  // Create application
  const application = {
    applicant: req.user.id,
    message: req.body.message,
    proposedPrice: req.body.proposedPrice,
    proposedDeadline: req.body.proposedDeadline,
    status: 'pending'
  };
  
  // Add application to task
  task.applications.push(application);
  await task.save();
  
  res.status(201).json({
    status: 'success',
    data: {
      application
    }
  });
});

// @desc    Accept an application
// @route   POST /api/tasks/:id/applications/:applicationId/accept
// @access  Private
exports.acceptApplication = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if user is the creator of the task
  if (task.creator.toString() !== req.user.id.toString()) {
    return next(new AppError('You are not authorized to accept applications for this task', 403));
  }
  
  // Find the application
  const application = task.applications.id(req.params.applicationId);
  
  if (!application) {
    return next(new AppError('No application found with that ID', 404));
  }
  
  // Check if task is still open
  if (task.status !== 'open') {
    return next(new AppError('This task has already been assigned', 400));
  }
  
  // Update application status
  application.status = 'accepted';
  
  // Update task status and assign to applicant
  task.status = 'assigned';
  task.assignedTo = application.applicant;
  
  // If applicant proposed a different price, update task price
  if (application.proposedPrice !== task.price) {
    task.price = application.proposedPrice;
  }
  
  // If applicant proposed a different deadline, update task deadline
  if (application.proposedDeadline !== task.deadline) {
    task.deadline = application.proposedDeadline;
  }
  
  // Save the task
  await task.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      task
    }
  });
});

// Helper function to get AI suggestions for a task
const getAISuggestions = async (taskData) => {
  const { title, description, category, requiredSkills } = taskData;
  
  const prompt = `
    Task Title: ${title}
    Task Description: ${description}
    Category: ${category}
    Required Skills: ${requiredSkills.join(', ')}
    
    Please provide 2-3 helpful suggestions or recommendations for completing this task effectively.
  `;
  
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    max_tokens: 150,
    temperature: 0.7,
    n: 1
  });
  
  const text = response.data.choices[0].text.trim();
  
  // Split text into individual suggestions
  const suggestions = text
    .split(/\d+\.\s+/) // Split by numbered lists: "1. ", "2. ", etc.
    .filter(Boolean)   // Remove empty strings
    .map(s => s.trim()); // Trim whitespace
  
  return suggestions;
}; 