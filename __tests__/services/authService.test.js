const { OAuth2Client } = require('google-auth-library');
const authService = require('../../services/authService');
const userModel = require('../../models/userModel');

jest.mock('google-auth-library');
jest.mock('../../models/userModel');

describe('Auth Service Tests', () => {
    const mockToken = 'fake-google-token';
    const mockPayload = {
        sub: '12345',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/photo.jpg'
    };

    const mockUser = {
        id: 1,
        googleId: mockPayload.sub,
        email: mockPayload.email,
        name: mockPayload.name,
        picture: mockPayload.picture
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock OAuth2Client verification
        OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => mockPayload
        });
    });

    describe('handleGoogleSignIn', () => {
        test('should return existing user when googleId is found', async () => {
            userModel.findUserByGoogleId.mockResolvedValue(mockUser);

            const result = await authService.handleGoogleSignIn(mockToken);

            expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith({
                idToken: mockToken,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            expect(userModel.findUserByGoogleId).toHaveBeenCalledWith(mockPayload.sub);
            expect(userModel.createUser).not.toHaveBeenCalled();
            expect(result).toEqual(mockUser);
        });

        test('should create new user when googleId is not found', async () => {
            userModel.findUserByGoogleId.mockResolvedValue(null);
            userModel.createUser.mockResolvedValue(mockUser);

            const result = await authService.handleGoogleSignIn(mockToken);

            expect(userModel.findUserByGoogleId).toHaveBeenCalledWith(mockPayload.sub);
            expect(userModel.createUser).toHaveBeenCalledWith({
                googleId: mockPayload.sub,
                email: mockPayload.email,
                name: mockPayload.name,
                picture: mockPayload.picture
            });
            expect(result).toEqual(mockUser);
        });

        test('should throw error when token verification fails', async () => {
            const error = new Error('Token verification failed');
            OAuth2Client.prototype.verifyIdToken.mockRejectedValue(error);

            await expect(authService.handleGoogleSignIn(mockToken))
                .rejects
                .toThrow('Token verification failed');
        });

        test('should throw error when user creation fails', async () => {
            userModel.findUserByGoogleId.mockResolvedValue(null);
            userModel.createUser.mockRejectedValue(new Error('Database error'));

            await expect(authService.handleGoogleSignIn(mockToken))
                .rejects
                .toThrow('Database error');
        });
    });
});
