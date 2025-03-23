const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CoAI API is running' });
});

// Import routes
// const userRoutes = require('./routes/userRoutes');
// const taskRoutes = require('./routes/taskRoutes');
// const walletRoutes = require('./routes/walletRoutes');
// const aiRoutes = require('./routes/aiRoutes');

// Use routes
// app.use('/api/users', userRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/wallet', walletRoutes);
// app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server',
  });
});

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    // Uncomment when MongoDB is available
    // await mongoose.connect(process.env.MONGODB_URI);
    // console.log('Connected to MongoDB');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 