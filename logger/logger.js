var winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY/MM/DD HH:mm:ss" }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console({ timestamp: true }),
    new winston.transports.File({
      filename: "./logs/logger.log",
      timestamp: true,
    }),
  ],
});
module.exports = logger;
