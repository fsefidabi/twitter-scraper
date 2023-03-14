const pino = require("pino");

require("dotenv").config();

const logger = pino({
  level: process.env.PINO_LOG_LEVEL || "info"
});

module.exports = logger;
