const { Connection, PublicKey, Transaction } = require('@solana/web3.js');
const { TokenProgram } = require('@solana/spl-token');
const User = require('../models/User');
const TransactionModel = require('../models/Transaction');
const Task = require('../models/Task');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Create Solana connection
const connection = new Connection(process.env.SOLANA_RPC_URL);

// @desc    Get wallet balance
// @route   GET /api/wallet/balance/:walletAddress
// @access  Public
exports.getWalletBalance = catchAsync(async (req, res, next) => {
  const { walletAddress } = req.params;
  
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    
    res.status(200).json({
      status: 'success',
      data: {
        balance: balance / 1e9, // Convert lamports to SOL
        lamports: balance
      }
    });
  } catch (error) {
    return next(new AppError('Error fetching wallet balance', 400));
  }
});

// @desc    Get token balance (CoAI token)
// @route   GET /api/wallet/token-balance/:walletAddress
// @access  Public
exports.getTokenBalance = catchAsync(async (req, res, next) => {
  const { walletAddress } = req.params;
  
  try {
    // This is a placeholder for actual token balance fetching logic
    // In a real implementation, we'd use TokenProgram to fetch token balance
    
    // For now, we'll return the user's balance from our database
    const user = await User.findOne({ walletAddress });
    
    if (!user) {
      return next(new AppError('User not found', 404));
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        balance: user.balance,
        symbol: 'CoAI'
      }
    });
  } catch (error) {
    return next(new AppError('Error fetching token balance', 400));
  }
});

// @desc    Create escrow deposit for a task
// @route   POST /api/wallet/escrow/:taskId
// @access  Private
exports.createEscrow = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId);
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if user is the creator of the task
  if (task.creator.toString() !== req.user.id.toString()) {
    return next(new AppError('You are not authorized to create escrow for this task', 403));
  }
  
  // Check if task is in proper status
  if (task.status !== 'assigned') {
    return next(new AppError('Can only create escrow for assigned tasks', 400));
  }
  
  // Check if task has an assignee
  if (!task.assignedTo) {
    return next(new AppError('Task has no assignee', 400));
  }
  
  // Create transaction record for escrow
  const transaction = await TransactionModel.create({
    from: req.user.id,
    to: req.user.id, // Initially to self (escrow)
    amount: task.price,
    task: task._id,
    type: 'escrow_deposit',
    status: 'pending',
    description: `Escrow deposit for task: ${task.title}`
  });
  
  // In a real implementation, we would create an escrow contract on Solana
  // For now, we'll simulate it with a transaction status
  
  // Update transaction status
  transaction.status = 'completed';
  transaction.transactionHash = `simulated_${Date.now()}`;
  await transaction.save();
  
  // Add transaction to task
  task.transactions.push(transaction._id);
  await task.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      transaction
    }
  });
});

// @desc    Release escrow payment
// @route   POST /api/wallet/release-payment/:taskId
// @access  Private
exports.releasePayment = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.taskId)
    .populate('assignedTo')
    .populate('creator');
  
  if (!task) {
    return next(new AppError('No task found with that ID', 404));
  }
  
  // Check if user is the creator of the task
  if (task.creator._id.toString() !== req.user.id.toString()) {
    return next(new AppError('You are not authorized to release payment for this task', 403));
  }
  
  // Check if task is in proper status
  if (task.status !== 'completed') {
    return next(new AppError('Can only release payment for completed tasks', 400));
  }
  
  // Find the escrow transaction
  const escrowTransaction = await TransactionModel.findOne({
    task: task._id,
    type: 'escrow_deposit',
    status: 'completed'
  });
  
  if (!escrowTransaction) {
    return next(new AppError('No escrow found for this task', 404));
  }
  
  // Create transaction record for payment release
  const transaction = await TransactionModel.create({
    from: req.user.id,
    to: task.assignedTo._id,
    amount: task.price,
    task: task._id,
    type: 'escrow_release',
    status: 'pending',
    description: `Payment for task: ${task.title}`
  });
  
  // Calculate platform fee (5%)
  const platformFee = Math.round(task.price * 0.05 * 100) / 100;
  
  // Calculate AI contribution fee based on aiAssistanceLevel
  let aiContributionPercentage = 0;
  if (task.aiAssistanceLevel === 'Low') {
    aiContributionPercentage = 0.05; // 5%
  } else if (task.aiAssistanceLevel === 'Medium') {
    aiContributionPercentage = 0.1; // 10%
  } else if (task.aiAssistanceLevel === 'High') {
    aiContributionPercentage = 0.15; // 15%
  }
  
  const aiContributionFee = Math.round(task.price * aiContributionPercentage * 100) / 100;
  
  // In a real implementation, we would release the escrow on Solana
  // For now, we'll simulate it with updating transaction status
  
  // Update transaction status
  transaction.status = 'completed';
  transaction.transactionHash = `simulated_${Date.now()}`;
  transaction.platformFee = platformFee;
  transaction.aiContributionFee = aiContributionFee;
  await transaction.save();
  
  // Add transaction to task
  task.transactions.push(transaction._id);
  
  // Update task status
  task.status = 'completed';
  task.completionDate = new Date();
  await task.save();
  
  // Update user balances
  // Assignee gets payment minus fees
  const netPayment = task.price - platformFee - aiContributionFee;
  await User.findByIdAndUpdate(task.assignedTo._id, {
    $inc: { 
      balance: netPayment,
      totalTasksCompleted: 1 
    }
  });
  
  res.status(200).json({
    status: 'success',
    data: {
      transaction,
      netPayment,
      platformFee,
      aiContributionFee
    }
  });
}); 