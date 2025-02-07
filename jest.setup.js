const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

// Mock logger to prevent test output pollution
jest.mock('./utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
}));

// Mock Prisma
jest.mock('./config/prisma', () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
    },
}));

// Global test setup
beforeAll(() => {

    // Set test environment variables
    process.env.GOOGLE_CLIENT_ID = 'test-client-id';
    process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';

    // Clear all mocks before starting tests
    jest.clearAllMocks();
});

// Reset mocks between tests
beforeEach(() => {
    jest.clearAllMocks();
});

// Cleanup after all tests
afterAll(() => {

    // Clean up any test data or connections
});
