const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  verifications: {
    type: Number,
    default: 0
  }
});

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nonce: {
    type: String,
    required: true,
    default: () => Math.floor(Math.random() * 1000000).toString()
  },
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500
  },
  profilePicture: {
    type: String,
  },
  skills: [SkillSchema],
  balance: {
    type: Number,
    default: 0
  },
  reputation: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalTasksCompleted: {
    type: Number,
    default: 0
  },
  totalTasksCreated: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for average rating
UserSchema.virtual('averageRating').get(function() {
  return this.reputation;
});

// Method to generate auth token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, walletAddress: this.walletAddress, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};

// Method to update nonce
UserSchema.methods.updateNonce = async function() {
  this.nonce = Math.floor(Math.random() * 1000000).toString();
  await this.save();
  return this.nonce;
};

// Method to verify wallet signature
UserSchema.methods.verifySignature = function(signature, message) {
  // This would be implemented with Solana web3.js or other library
  // For now, we'll assume it's already verified
  return true;
};

// Static method to find user by wallet address
UserSchema.statics.findByWalletAddress = async function(walletAddress) {
  const user = await this.findOne({ walletAddress });
  return user;
};

// Middleware to update lastLogin on save
UserSchema.pre('save', function(next) {
  if (this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User; 