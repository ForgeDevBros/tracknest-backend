const authService = require('../services/authService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

const googleSignIn = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return sendErrorResponse(res, 400, 'Bearer token is required.');
        }

        const token = authHeader.split(' ')[1];
        const user = await authService.handleGoogleSignIn(token);
        if (!user) {
            return sendErrorResponse(res, 401, 'Invalid token.');
        }

        sendSuccessResponse(res, 200, 'User authenticated successfully.', {
            id: user.id,
            name: user.name,
            email: user.email,
            picture: user.picture,
        });
    } catch (error) {
        console.error(error);
        sendErrorResponse(res, 500, 'Internal server error.');
    }
};

module.exports = {
    googleSignIn,
};
