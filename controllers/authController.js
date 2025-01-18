const authService = require('../services/authService');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHelper');

const googleSignIn = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return sendErrorResponse(res, 400, 'Google token is required.');
        }

        const user = await authService.handleGoogleSignIn(token);
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
