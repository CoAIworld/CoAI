const User = require('../models/User');
const Task = require('../models/Task');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find().select('-__v');
  
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-__v');
  
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Get user by wallet address
// @route   GET /api/users/wallet/:walletAddress
// @access  Public
exports.getUserByWalletAddress = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ walletAddress: req.params.walletAddress }).select('-__v');
  
  if (!user) {
    return next(new AppError('No user found with that wallet address', 404));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = catchAsync(async (req, res, next) => {
  // Fields allowed to be updated
  const allowedFields = ['name', 'email', 'bio', 'profilePicture'];
  
  // Filter out unwanted fields
  const filteredBody = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      filteredBody[key] = req.body[key];
    }
  });
  
  // Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  }).select('-__v');
  
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

// @desc    Add a skill to user profile
// @route   POST /api/users/skills
// @access  Private
exports.addSkill = catchAsync(async (req, res, next) => {
  const { name, level } = req.body;
  
  if (!name || !level) {
    return next(new AppError('Please provide name and level for the skill', 400));
  }
  
  // Find user
  const user = await User.findById(req.user.id);
  
  // Check if skill already exists
  const existingSkill = user.skills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
  
  if (existingSkill) {
    return next(new AppError('You already have this skill in your profile', 400));
  }
  
  // Add skill
  user.skills.push({ name, level, verifications: 0 });
  await user.save();
  
  res.status(201).json({
    status: 'success',
    data: {
      skills: user.skills
    }
  });
});

// @desc    Update a skill
// @route   PUT /api/users/skills/:skillId
// @access  Private
exports.updateSkill = catchAsync(async (req, res, next) => {
  const { level } = req.body;
  
  if (!level) {
    return next(new AppError('Please provide level for the skill', 400));
  }
  
  // Find user
  const user = await User.findById(req.user.id);
  
  // Find skill
  const skill = user.skills.id(req.params.skillId);
  
  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }
  
  // Update skill
  skill.level = level;
  await user.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      skills: user.skills
    }
  });
});

// @desc    Delete a skill
// @route   DELETE /api/users/skills/:skillId
// @access  Private
exports.deleteSkill = catchAsync(async (req, res, next) => {
  // Find user
  const user = await User.findById(req.user.id);
  
  // Find skill
  const skill = user.skills.id(req.params.skillId);
  
  if (!skill) {
    return next(new AppError('No skill found with that ID', 404));
  }
  
  // Remove skill
  skill.remove();
  await user.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      skills: user.skills
    }
  });
});

// @desc    Get user tasks (created and assigned)
// @route   GET /api/users/tasks
// @access  Private
exports.getUserTasks = catchAsync(async (req, res, next) => {
  // Get tasks created by the user
  const createdTasks = await Task.find({ creator: req.user.id })
    .sort('-createdAt')
    .populate({
      path: 'assignedTo',
      select: 'name walletAddress reputation'
    });
  
  // Get tasks assigned to the user
  const assignedTasks = await Task.find({ assignedTo: req.user.id })
    .sort('-createdAt')
    .populate({
      path: 'creator',
      select: 'name walletAddress reputation'
    });
  
  res.status(200).json({
    status: 'success',
    data: {
      createdTasks,
      assignedTasks
    }
  });
});

// @desc    Get user applications
// @route   GET /api/users/applications
// @access  Private
exports.getUserApplications = catchAsync(async (req, res, next) => {
  // Find tasks with applications from this user
  const tasks = await Task.find({
    'applications.applicant': req.user.id
  }).populate({
    path: 'creator',
    select: 'name walletAddress reputation'
  });
  
  // Extract applications
  const applications = tasks.map(task => {
    const application = task.applications.find(
      app => app.applicant.toString() === req.user.id.toString()
    );
    
    return {
      task: {
        id: task._id,
        title: task.title,
        category: task.category,
        price: task.price,
        deadline: task.deadline,
        status: task.status,
        creator: task.creator
      },
      application: {
        id: application._id,
        message: application.message,
        proposedPrice: application.proposedPrice,
        proposedDeadline: application.proposedDeadline,
        status: application.status,
        createdAt: application.createdAt
      }
    };
  });
  
  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: {
      applications
    }
  });
});

// @desc    Get user balance and transactions
// @route   GET /api/users/balance
// @access  Private
exports.getUserBalance = catchAsync(async (req, res, next) => {
  // Get user
  const user = await User.findById(req.user.id);
  
  // Get recent transactions
  const transactions = await Transaction.find({
    $or: [
      { from: req.user.id },
      { to: req.user.id }
    ]
  })
    .sort('-createdAt')
    .limit(10)
    .populate({
      path: 'from',
      select: 'name walletAddress'
    })
    .populate({
      path: 'to',
      select: 'name walletAddress'
    })
    .populate({
      path: 'task',
      select: 'title'
    });
  
  // Calculate total earnings and spending
  const totalEarnings = await Transaction.getTotalEarnings(req.user.id);
  const totalSpending = await Transaction.getTotalSpending(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      balance: user.balance,
      totalEarnings,
      totalSpending,
      transactions
    }
  });
}); 