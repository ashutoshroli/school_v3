const winston = require('winston');
const config = require('../config');

const { combine, timestamp, printf, colorize, json } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: config.logging.level,
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat)
    }),
    new winston.transports.File({
      filename: config.logging.file,
      format: combine(timestamp(), json())
    })
  ]
});

if (config.nodeEnv === 'test') {
  logger.transports.forEach(transport => {
    transport.silent = true;
  });
}

module.exports = logger;
