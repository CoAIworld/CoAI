const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Task = require('../models/Task');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Admin
exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find()
    .sort('-createdAt')
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
  
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
});

// @desc    Get a single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id)
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
      select: 'title description status'
    });
  
  if (!transaction) {
    return next(new AppError('No transaction found with that ID', 404));
  }
  
  // Check if user is involved in the transaction
  if (transaction.from.toString() !== req.user.id.toString() && 
      transaction.to.toString() !== req.user.id.toString() &&
      req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to view this transaction', 403));
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      transaction
    }
  });
});

// @desc    Get user transactions
// @route   GET /api/transactions/user
// @access  Private
exports.getUserTransactions = catchAsync(async (req, res, next) => {
  const transactions = await Transaction.find({
    $or: [
      { from: req.user.id },
      { to: req.user.id }
    ]
  })
    .sort('-createdAt')
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
  
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
});

// @desc    Get task transactions
// @route   GET /api/transactions/task/:taskId
// @access  Private
exports.getTaskTransactions = catchAsync(async (req, res, next) => {
  // Find the task
  const task = await Task.findById(req.params.taskId);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if user is involved in the task
  if (task.creator.toString() !== req.user.id.toString() && 
      (!task.assignedTo || task.assignedTo.toString() !== req.user.id.toString()) &&
      req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to view transactions for this task', 403));
  }
  
  // Get transactions for this task
  const transactions = await Transaction.find({ task: req.params.taskId })
    .sort('-createdAt')
    .populate({
      path: 'from',
      select: 'name walletAddress'
    })
    .populate({
      path: 'to',
      select: 'name walletAddress'
    });
  
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
}); 