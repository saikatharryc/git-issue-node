const rp = require("request-promise");
const githubApiBase = require("../config").github.base;

const locateRepo = async (username, reponame) => {
  const options = {
    uri: githubApiBase + "/repos/" + username + "/" + reponame,
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

const getIssuesByRepo = async (username, reponame, page = 1) => {
  const options = {
    uri: githubApiBase + "/repos/" + username + "/" + reponame + "/issues",
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
  getIssuesByRepo
};
