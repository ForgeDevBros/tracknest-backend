const winston = require('winston');
const logger = require('../../utils/logger');

jest.mock('winston', () => ({
    createLogger: jest.fn().mockReturnValue({
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn()
    }),
    format: {
        combine: jest.fn(),
        timestamp: jest.fn(),
        printf: jest.fn(),
    },
    transports: {
        Console: jest.fn(),
        DailyRotateFile: jest.fn(),
        File: jest.fn()
    }
}));

describe('Logger Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('logger methods should be available', () => {
        expect(typeof logger.info).toBe('function');
        expect(typeof logger.error).toBe('function');
        expect(typeof logger.warn).toBe('function');
    });

    test('logger should handle messages correctly', () => {
        const testMessage = 'Test message';

        logger.info(testMessage);
        logger.error(testMessage);
        logger.warn(testMessage);

        expect(logger.info).toHaveBeenCalledWith(testMessage);
        expect(logger.error).toHaveBeenCalledWith(testMessage);
        expect(logger.warn).toHaveBeenCalledWith(testMessage);
    });
});
