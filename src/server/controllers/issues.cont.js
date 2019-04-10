const Repos = require("../models/Repos");
const Issues = require("../models/Issues");

const IssueHelper = require("../helpers/issues.helper");

const locateRepo = async (username, reponame) => {
  const data = await IssueHelper.locateRepo(username, reponame);
  const dataToSend = {
    repoId: data.id,
    repoName: data.name,
    totalIssuesOpen: {
      type: data.open_issues_count
    },
    ownerMeta: {
      avatar_url: data.owner.avatar_url,
      name: data.owner.login
    }
  };
  const savableData = new Repos(dataToSend);
  return savableData.save();
};

const getIssues = async (username, reponame, repoId, page = 1) => {
  const data = await IssueHelper.getIssuesByRepo(username, reponame, page);
  const pureIssues = data.filter(item => {
    if (!item.pull_request)
      return {
        repo: repoId,
        issueTitle: item.title,
        body: item.body,
        number: item.number,
        opendAt: new Date(item.created_at)
      };
  });
  const matchFields = ["repo"];

  //Perform bulk operation
  await Issues.upsertMany(items, matchFields);
  return pureIssues;
};

module.exports = {
  locateRepo,
  getIssues
};
