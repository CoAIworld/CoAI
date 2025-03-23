const mongoose = require('mongoose');

const SkillRatingSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
});

const FeedbackSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500
  },
  skillRatings: [SkillRatingSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only provide one feedback per task
FeedbackSchema.index({ task: 1, sender: 1, receiver: 1 }, { unique: true });

// Static method to calculate average rating for a user
FeedbackSchema.statics.calculateAverageRating = async function(userId) {
  const result = await this.aggregate([
    {
      $match: { receiver: mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 
    ? { rating: result[0].averageRating, count: result[0].count } 
    : { rating: 0, count: 0 };
};

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback; 