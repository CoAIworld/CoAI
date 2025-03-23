const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please log in to get access.', 401));
  }

  // 2) Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

// Restrict to certain roles
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Check if user is the owner of a resource
exports.isOwner = (model) => catchAsync(async (req, res, next) => {
  const resource = await model.findById(req.params.id);
  
  if (!resource) {
    return next(new AppError('No resource found with that ID', 404));
  }
  
  // Check if user is the owner
  if (resource.creator && resource.creator.toString() !== req.user.id.toString() &&
      resource.user && resource.user.toString() !== req.user.id.toString()) {
    return next(new AppError('You are not authorized to access this resource', 403));
  }
  
  req.resource = resource;
  next();
}); 