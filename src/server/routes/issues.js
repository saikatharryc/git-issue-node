const express = require("express");
const router = express.Router();
const issuesCont = require("../controllers/issues.cont");

/**
 * Search For the repo and upsert the necessery items in DB
 */
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

/**
 * Fetches issues details and upserts in DB
 *
 */
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

/**
 * Fetches Group by records from the DB by the repo ID [from mongo]
 */
router.get("/visit/history", (req, res, next) => {
  return issuesCont
    .getSavedSearches()
    .then(data => {
      return res.json(data);
    })
    .catch(error => {
      return next(error);
    });
});
module.exports = router;
