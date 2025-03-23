const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  proposedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  proposedDeadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AttachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalname: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const AIContributionSchema = new mongoose.Schema({
  suggestion: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['enhancement', 'correction', 'recommendation'],
    default: 'recommendation'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  requiredSkills: [{
    type: String,
    trim: true
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  deadline: {
    type: Date,
    required: true
  },
  aiAssistanceLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  applications: [ApplicationSchema],
  attachments: [AttachmentSchema],
  aiContributions: [AIContributionSchema],
  status: {
    type: String,
    enum: ['draft', 'open', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  completionDate: {
    type: Date
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
  creatorRating: {
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date
    }
  },
  workerRating: {
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for remaining time
TaskSchema.virtual('remainingTime').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') return 0;
  const now = new Date();
  return Math.max(0, this.deadline - now);
});

// Virtual for application count
TaskSchema.virtual('applicationsCount').get(function() {
  return this.applications.length;
});

// Index for searching tasks
TaskSchema.index({ title: 'text', description: 'text', category: 'text', requiredSkills: 'text' });

// Middleware to update related documents on task status changes
TaskSchema.pre('save', async function(next) {
  const Task = this.constructor;
  
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completionDate) {
      this.completionDate = new Date();
    }
  }
  
  next();
});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task; 