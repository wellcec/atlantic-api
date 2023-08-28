const winston = require('winston')

const { combine, timestamp, label, printf } = winston.format

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`
})

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console()
  ],
  format: combine(
    label({ label: 'BOOKMAGIC' }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize(),
    logFormat,
  ),
})

export default logger