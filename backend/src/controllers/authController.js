const User = require('../models/User');
const { PublicKey } = require('@solana/web3.js');
const bs58 = require('bs58');
const nacl = require('tweetnacl');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// @desc    Get a nonce for wallet authentication
// @route   GET /api/auth/nonce/:walletAddress
// @access  Public
exports.getNonce = catchAsync(async (req, res, next) => {
  const { walletAddress } = req.params;
  
  // Validate wallet address
  try {
    new PublicKey(walletAddress);
  } catch (error) {
    return next(new AppError('Invalid wallet address', 400));
  }
  
  // Find user or create if doesn't exist
  let user = await User.findByWalletAddress(walletAddress);
  
  if (!user) {
    user = await User.create({
      walletAddress,
      nonce: Math.floor(Math.random() * 1000000).toString()
    });
  }
  
  // Return nonce for signing
  res.status(200).json({
    status: 'success',
    data: {
      nonce: user.nonce,
      message: `Sign this message to authenticate with CoAI: ${user.nonce}`
    }
  });
});

// @desc    Authenticate with wallet signature
// @route   POST /api/auth/verify
// @access  Public
exports.verifySignature = catchAsync(async (req, res, next) => {
  const { walletAddress, signature, message } = req.body;
  
  if (!walletAddress || !signature || !message) {
    return next(new AppError('Please provide walletAddress, signature and message', 400));
  }
  
  // Find user
  const user = await User.findByWalletAddress(walletAddress);
  
  if (!user) {
    return next(new AppError('User not found', 404));
  }
  
  // Verify the message contains the correct nonce
  if (!message.includes(user.nonce)) {
    return next(new AppError('Invalid message', 400));
  }
  
  // Verify signature
  try {
    const publicKey = new PublicKey(walletAddress);
    const signatureUint8 = bs58.decode(signature);
    const messageUint8 = new TextEncoder().encode(message);
    
    const isValid = nacl.sign.detached.verify(
      messageUint8,
      signatureUint8,
      publicKey.toBytes()
    );
    
    if (!isValid) {
      return next(new AppError('Invalid signature', 401));
    }
  } catch (error) {
    return next(new AppError('Signature verification failed', 401));
  }
  
  // Update nonce for security
  await user.updateNonce();
  
  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });
  
  // Generate token
  const token = user.generateAuthToken();
  
  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user._id,
        walletAddress: user.walletAddress,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        reputation: user.reputation
      }
    }
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = catchAsync(async (req, res, next) => {
  // In a token-based system, actual logout happens on the client side
  // by removing the token from storage
  
  // Update nonce to invalidate any signature created with the old one
  await req.user.updateNonce();
  
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
}); 