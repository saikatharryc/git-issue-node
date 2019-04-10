const Repos = require("../models/Repos");
const Issues = require("../models/Issues");

const IssueHelper = require("../helpers/issues.helper");

const locateRepo = async (username, reponame) => {
  const data = await IssueHelper.locateRepo(username, reponame);
  const dataToSend = {
    repoId: data.id,
    reponame: data.name,
    totalIssuesOpen: data.open_issues_count
      ? Number(data.open_issues_count)
      : 0,

    ownerMeta: {
      avatar_url: data.owner.avatar_url,
      name: data.owner.login
    }
  };

  console.log(dataToSend);
  const found = await Repos.findOne({ repoId: data.id }).exec();
  if (!found) {
    const savableData = new Repos(dataToSend);
    return await savableData.save();
  } else {
    return found;
  }
};

const getIssues = async (username, reponame, repoId, page = 1) => {
  const data = await IssueHelper.getIssuesByRepo(username, reponame, page);
  const pureIssues = data.filter(item => {
    if (!item.pull_request)
      return new Repos({
        repo: repoId,
        issueTitle: item.title,
        body: item.body,
        number: item.number,
        opendAt: new Date(item.created_at)
      });
  });
  const matchFields = ["repo"];

  //Perform bulk operation
  await Issues.insertMany(pureIssues);
  return pureIssues;
};

module.exports = {
  locateRepo,
  getIssues
};
