const config = {
  MONGO: {
    URI:
      process.env.MONGO_URL ||
      "mongodb://<admin>:<password>@<host>:<port>/<db name | default admin>",
    OPTIONS: { useNewUrlParser: true }
  },
  github: {
    base: "https://api.github.com"
  }
};
Object.freeze(config);
module.exports = config;
