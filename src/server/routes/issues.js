const express = require("express");
const router = express.Router();
const issuesCont = require("../controllers/issues.cont");

router.post("/locateRepo", (req, res, next) => {
  const { username, reponame } = req.body;
  console.log(username, reponame);
  if (!username || !reponame) {
    return next({ status: 404, message: "please pass all the params" });
  }
  return issuesCont
    .locateRepo(username, reponame)
    .then(data => {
      console.log(data);
      return res.json({ success: true, ...data });
    })
    .catch(error => {
      console.log(error);
      return next(error);
    });
});

router.post("/", (req, res, next) => {
  const { username, reponame, repoId, page = 1 } = req.body;
  if (!username || !reponame) {
    return next({ status: 404, message: "please pass all the params" });
  }
  return issuesCont
    .getIssues(username, reponame, repoId, page)
    .then(data => {
      return res.json({ success: true, data: data });
    })
    .catch(error => {
      return next(error);
    });
});

module.exports = router;
