/**
 * Configuration settings for the CoAI backend
 */

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/coai',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  
  // JWT authentication configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'coai-development-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  
  // Solana configuration
  solana: {
    network: process.env.SOLANA_NETWORK || 'devnet',
    rpcUrl: process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    tokenMint: process.env.COAI_TOKEN_MINT,
  },
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4-turbo',
  },
  
  // Cors configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  }
}; 