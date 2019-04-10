const Repos = require("../models/Repos");
const Issues = require("../models/Issues");

const IssueHelper = require("../helpers/issues.helper");

/**
 * Searches for the repo & Saves to DB incase not exist
 * @param {String} username
 * @param {String} reponame
 */
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
      name: data.owner.login,
      id: data.owner.id
    }
  };
  const found = await Repos.findOne({ repoId: data.id })
    .lean()
    .exec();
  const lastDay = await IssueHelper.getIssueCount(username, reponame, 1);
  const lastweek =
    (await IssueHelper.getIssueCount(username, reponame, 2)) - lastDay;
  const moreThanAWeekAgo = dataToSend.totalIssuesOpen - (lastweek + lastDay);
  if (!found) {
    const savableData = new Repos(dataToSend);
    await savableData.save();
    return {
      ...dataToSend,
      lastDayOpenIssue: lastDay,
      lastWeekOpenIssue: lastweek,
      moreThanAweekOpenIssue: moreThanAWeekAgo
    };
  } else {
    return {
      ...found,
      lastDayOpenIssue: lastDay,
      lastWeekOpenIssue: lastweek,
      moreThanAweekOpenIssue: moreThanAWeekAgo
    };
  }
};

/**
 * Gets all issue in paginate manner by following filters
 * @param {String} username
 * @param {String} reponame
 * @param {String} repoId
 * @param {Number} page
 */
const getIssues = async (username, reponame, repoId, page = 1) => {
  const data = await IssueHelper.getIssuesByRepo(username, reponame, page);
  let pureIssues = [];
  data.forEach(item => {
    if (!item.pull_request) {
      pureIssues.push({
        html_url: item.html_url,
        repo: repoId,
        issueTitle: item.title,
        body: item.body,
        number: item.number,
        opendAt: new Date(item.created_at)
      });
    }
  });
  console.log(pureIssues);
  const matchFields = ["html_url"];

  //Perform bulk upsert operation
  await Issues.upsertMany(pureIssues, matchFields);
  return pureIssues;
};

/**
 * Simply fetches all the Repos searched for from DB
 */
const getSavedSearches = async () => {
  const data = await Repos.find({}).exec();
  console.log(data);
  return data;
};

module.exports = {
  locateRepo,
  getIssues,
  getSavedSearches
};
