const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  type: {
    type: String,
    enum: ['task_payment', 'escrow_deposit', 'escrow_release', 'refund', 'platform_fee', 'reward', 'other'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    trim: true
  },
  transactionHash: {
    type: String,
    trim: true
  },
  platformFee: {
    type: Number,
    default: 0
  },
  aiContributionFee: {
    type: Number,
    default: 0
  },
  metadata: {
    type: Object
  }
}, {
  timestamps: true
});

// Index for querying transactions
TransactionSchema.index({ from: 1, to: 1, task: 1, type: 1, status: 1, createdAt: -1 });

// Static method to calculate total earnings for a user
TransactionSchema.statics.getTotalEarnings = async function(userId) {
  const result = await this.aggregate([
    {
      $match: {
        to: mongoose.Types.ObjectId(userId),
        status: 'completed',
        $or: [
          { type: 'task_payment' },
          { type: 'escrow_release' },
          { type: 'reward' }
        ]
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

// Static method to calculate total spending for a user
TransactionSchema.statics.getTotalSpending = async function(userId) {
  const result = await this.aggregate([
    {
      $match: {
        from: mongoose.Types.ObjectId(userId),
        status: 'completed',
        $or: [
          { type: 'task_payment' },
          { type: 'escrow_deposit' }
        ]
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get transactions for a task
TransactionSchema.statics.getTaskTransactions = async function(taskId) {
  return this.find({ task: taskId }).sort({ createdAt: -1 });
};

// Middleware to verify transaction before saving
TransactionSchema.pre('save', async function(next) {
  if (this.isNew && this.type === 'task_payment') {
    // Calculate platform fee (5%)
    this.platformFee = Math.round(this.amount * 0.05 * 100) / 100;
    
    // Calculate AI contribution fee based on aiAssistanceLevel
    // This would be fetched from the task in a real implementation
    const aiContributionPercentage = 0.1; // 10% example
    this.aiContributionFee = Math.round(this.amount * aiContributionPercentage * 100) / 100;
  }
  
  next();
});

const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction; 