const rp = require("request-promise");
const moment = require("moment");
const githubApiBase = require("../config").github.base;

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
const getIssueCount = async (username, reponame, switcher) => {
  let since;
  if (switcher == 1) {
    since = moment()
      .subtract(24, "h")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  } else if (switcher == 2) {
    since = moment()
      .subtract(1, "week")
      .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
  }

  const options = {
    uri: githubApiBase + "/repos/" + username + "/" + reponame + "/issues",
    headers: {
      "User-Agent": "Request-Promise"
    },
    qs: {
      since: since
    },
    json: true
  };
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
