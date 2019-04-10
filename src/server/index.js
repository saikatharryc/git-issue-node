const express = require("express");
const os = require("os");
const config = require("./config");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(config.MONGO.URI, config.MONGO.OPTIONS);

app.use(express.static("dist"));
app.get("/api/getUsername", (req, res) =>
  res.send({ username: os.userInfo().username })
);

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
