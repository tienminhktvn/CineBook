const winston = require("winston");

// Define colorized console format
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} ${level}: ${message}`;
    if (Object.keys(meta).length > 0 && !meta.stack) {
      log += ` ${JSON.stringify(meta)}`;
    }
    if (meta.stack) {
      log += `\n${meta.stack}`;
    }
    return log;
  })
);

// Create the logger (console only)
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: consoleFormat,
  transports: [new winston.transports.Console()],
});

// Create HTTP request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const logLevel = statusCode >= 400 ? "warn" : "info";

    logger[logLevel](`${method} ${originalUrl} ${statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = {
  logger,
  requestLogger,
};
