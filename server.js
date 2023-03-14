const fs = require("fs");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const logger = require("./utils/logger");
const swaggerDocument = require("./swagger.json");
require("dotenv").config();

const app = express();

app.get("/", function (req, res, next) {
  logger.debug("Defining routes");
  const apisList = fs.readdirSync("./api");
  apisList.forEach(apiName => {
    const routes = require(`./api/${apiName}/routes/${apiName}.routes.json`);
    const controllers = require(`./api/${apiName}/controllers/${apiName}.controllers.js`);
    routes.routes.forEach(route => {
      app[route.method.toLowerCase()](`/api${route.path}`, controllers[route.handler]);
    });
  });
  res.send("Twitter Watch");
  next();
});

app.use(function (req, res, next) {
  logger.info(`Sending ${req.method} request to ${req.url}`);
  next();
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

const port = process.env.PORT || 8585;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
