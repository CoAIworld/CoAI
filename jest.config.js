module.exports = {
  projects: [
    {
      displayName: 'frontend',
      rootDir: '<rootDir>/frontend',
      testMatch: ['<rootDir>/src/__tests__/**/*.{js,jsx,ts,tsx}'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
    },
    {
      displayName: 'backend',
      rootDir: '<rootDir>/backend',
      testMatch: ['<rootDir>/src/__tests__/**/*.{js,jsx,ts,tsx}'],
      testEnvironment: 'node',
      transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
      },
    },
  ],
  collectCoverageFrom: [
    'frontend/src/**/*.{js,jsx,ts,tsx}',
    'backend/src/**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
    '!**/__tests__/**',
  ],
  coverageDirectory: 'coverage',
}; 