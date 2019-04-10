const express = require("express");
const os = require("os");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const config = require("./config");
const apiRoutes = require("./routes");

const app = express();

mongoose.connect(config.MONGO.URI, config.MONGO.OPTIONS);

app.use(express.static("dist"));
// enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
apiRoutes.includeRoutes(app);

app.get("/api/getUsername", (req, res) =>
  res.send({ username: os.userInfo().username })
);

/**
 * Error Handle in Top layer
 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  // res.status(err.status || 500).json({ err: err.message });
  const errorObj = {
    service: "-_-"
  };
  if (err.status === 400) {
    if (err.validationErrors) {
      errorObj.validationErrors = err.validationErrors;
    }
    errorObj.message = err.message || "Invalid Values Supplied";
    errorObj.head = err.head || null;
  } else if (err.status === 401 || err.status === 403) {
    errorObj.head = err.head || null;
    errorObj.message = err.message || "Unauthorized User";
  } else if (err.status === 500) {
    errorObj.head = err.head || null;

    errorObj.message = err.message;

    errorObj.message = "Internal Server Error";
  } else if (err.status === 404) {
    errorObj.head = err.head || null;
    errorObj.message = err.message;
  } else {
    errorObj.head = err.head || null;

    errorObj.message = err.message || "Unknown Error Occurred";
  }

  next();
  return res.status(err.status || 500).json(errorObj);
});
process.on("SIGTERM", function() {
  //do something before Gracefully shut it down
  process.exit(0);
});
process.on("SIGINT", function() {
  //do something before Gracefully shut it down
  process.exit(0);
});

app.listen(process.env.PORT || 8080, () =>
  console.log(`Listening on port ${process.env.PORT || 8080}!`)
);
