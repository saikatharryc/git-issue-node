const issues = require("./issues");

const api = {};

api.includeRoutes = app => {
  app.use("/api/v1/issues", issues);
};

module.exports = api;
