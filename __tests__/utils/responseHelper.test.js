const { sendSuccessResponse, sendErrorResponse } = require('../../utils/responseHelper');

describe('Response Helper Tests', () => {
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('sendSuccessResponse', () => {
        test('should send success response with data', () => {
            const statusCode = 200;
            const message = 'Success message';
            const data = { key: 'value' };

            sendSuccessResponse(mockRes, statusCode, message, data);

            expect(mockRes.status).toHaveBeenCalledWith(statusCode);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message,
                data
            });
        });

        test('should send success response without data', () => {
            const statusCode = 201;
            const message = 'Created successfully';

            sendSuccessResponse(mockRes, statusCode, message);

            expect(mockRes.status).toHaveBeenCalledWith(statusCode);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                message,
                data: {}
            });
        });
    });

    describe('sendErrorResponse', () => {
        test('should send error response', () => {
            const statusCode = 400;
            const message = 'Bad request';

            sendErrorResponse(mockRes, statusCode, message);

            expect(mockRes.status).toHaveBeenCalledWith(statusCode);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message
            });
        });

        test('should send internal server error', () => {
            const statusCode = 500;
            const message = 'Internal server error';

            sendErrorResponse(mockRes, statusCode, message);

            expect(mockRes.status).toHaveBeenCalledWith(statusCode);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                message
            });
        });
    });
});
