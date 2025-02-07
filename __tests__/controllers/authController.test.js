const authController = require('../../controllers/authController');
const authService = require('../../services/authService');
const { sendSuccessResponse, sendErrorResponse } = require('../../utils/responseHelper');

// Mock dependencies
jest.mock('../../services/authService');
jest.mock('../../utils/responseHelper');
jest.mock('../../config/prisma', () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}));
describe('Auth Controller Tests', () => {
    let mockReq;
    let mockRes;
    let consoleSpy;

    beforeEach(() => {
        mockReq = {
            body: {
                token: 'fake-google-token'
            }
        };
        mockRes = {};
        // Spy on console.error
        consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    describe('googleSignIn', () => {
        test('should successfully authenticate user with valid token', async () => {
            const mockUser = {
                id: '123',
                name: 'Test User',
                email: 'test@example.com',
                picture: 'profile.jpg'
            };

            authService.handleGoogleSignIn.mockResolvedValue(mockUser);

            await authController.googleSignIn(mockReq, mockRes);

            expect(authService.handleGoogleSignIn).toHaveBeenCalledWith('fake-google-token');
            expect(sendSuccessResponse).toHaveBeenCalledWith(
                mockRes,
                200,
                'User authenticated successfully.',
                mockUser
            );
        });

        test('should return error when token is missing', async () => {
            mockReq.body = {};

            await authController.googleSignIn(mockReq, mockRes);

            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                400,
                'Google token is required.'
            );
        });

        test('should handle internal server error', async () => {
            authService.handleGoogleSignIn.mockRejectedValue(new Error('Service error'));

            await authController.googleSignIn(mockReq, mockRes);

            expect(consoleSpy).toHaveBeenCalled();
            expect(sendErrorResponse).toHaveBeenCalledWith(
                mockRes,
                500,
                'Internal server error.'
            );
        });
    });
});