const sendSuccessResponse = (res, statusCode, message, data = {}) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const sendErrorResponse = (res, statusCode, message) => {
    res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = {
    sendSuccessResponse,
    sendErrorResponse,
};
