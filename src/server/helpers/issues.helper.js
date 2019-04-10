/**
 * Here we are processing all the API related operations
 */

const rp = require("request-promise");
const moment = require("moment");
const githubApiBase = require("../config").github.base;

/**
 * fetchesrepo details
 * @param {String} username
 * @param {String} reponame
 */
const locateRepo = async (username, reponame) => {
  const options = {
    uri: githubApiBase + "/repos/" + username + "/" + reponame,
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true
  };
  try {
    const repoData = await rp(options);

    return repoData;
  } catch (ex) {
    return Promise.reject({
      message: ex.error.message || "unknown error occured.",
      status: ex.statusCode
    });
  }
};

/**
 * Retrives the count for the different date segment
 * @param {String} username
 * @param {String} reponame
 * @param {Number} switcher
 * switcher can have 1 when need to set the date upto 24 hours.
 * for 2 it sets the date to 1 week
 */
const getIssueCount = async (username, reponame, switcher) => {
  const options = {
    uri: githubApiBase + "/repos/" + username + "/" + reponame + "/issues",
    headers: {
      "User-Agent": "Request-Promise"
    },
    qs: {},
    json: true
  };

  if (switcher == 1) {
    options["qs"]["since"] = moment()
      .subtract(24, "h")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  } else if (switcher == 2) {
    options["qs"]["since"] = moment()
      .subtract(1, "week")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  }
  try {
    const issueData = await rp(options);
    return issueData.length;
  } catch (ex) {
    return Promise.reject({
      message: ex.error.message || "unknown error occured.",
      status: ex.statusCode
    });
  }
};
const getIssuesByRepo = async (username, reponame, page = 1) => {
  const options = {
    uri: githubApiBase + "/repos/" + username + "/" + reponame + "/issues",
    headers: {
      "User-Agent": "Request-Promise"
    },
    qs: {
      per_page: 20,
      page: page
    },
    json: true
  };
  try {
    const issueData = await rp(options);
    return issueData;
  } catch (ex) {
    return Promise.reject({
      message: ex.error.message || "unknown error occured.",
      status: ex.statusCode
    });
  }
};

module.exports = {
  locateRepo,
  getIssuesByRepo,
  getIssueCount
};
