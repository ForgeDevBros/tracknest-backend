const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf((info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
);
const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

const logger = createLogger({
    level: 'info', 
    format: logFormat,
    transports: [
        new transports.Console(), 
        dailyRotateFileTransport, 
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' }), 
    ],
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' }), 
    ],
});

module.exports = logger;
