const express = require("express");
const router = express.Router();
const issuesCont = require("../controllers/issues.cont");

router.post("/locateRepo", (req, res, next) => {
  const { userName, repoName } = req.body;
  if (!userName || !repoName) {
    return next({ status: 404, message: "please pass all the params" });
  }
  return issuesCont
    .locateRepo(userName, repoName)
    .then(data => {
      return res.json(data);
    })
    .catch(error => {
      return next(error);
    });
});

router.get("/issues", (req, res, next) => {
  const { userName, repoName, page = 1 } = req.body;
  if (!userName || !repoName) {
    return next({ status: 404, message: "please pass all the params" });
  }
  return issuesCont
    .getIssues(userName, repoName, page)
    .then(data => {
      return res.json(data);
    })
    .catch(error => {
      return next(error);
    });
});

module.exports = router;
