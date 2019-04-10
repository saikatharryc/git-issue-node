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
  const found = await Repos.findOne({ repoId: data.id })
    .lean()
    .exec();
  const lastDay = await IssueHelper.getIssueCount(username, reponame, 1);
  const lastweek =
    (await IssueHelper.getIssueCount(username, reponame, 2)) - lastDay;
  const moreThanAWeekAgo =
    (await IssueHelper.getIssueCount(username, reponame, 3)) -
    (lastweek + lastDay);
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

  //Perform bulk operation
  await Issues.upsertMany(pureIssues, matchFields);
  return pureIssues;
};

const getSavedSearches = async () => {
  console.log("<<Aggregate>>");
  const query = [
    {
      $lookup: {
        from: "issues",
        pipeline: [
          { $match: { _id: "$repo" } },
          { $project: { reponame: "$reponame", ownerMeta: "$ownerMeta" } }
        ],
        as: "repoDetails"
      }
    },
    {
      $group: {
        _id: "$repo",
        docs: { $push: "$$ROOT" }
      }
    }
  ];
  const data = await Issues.aggregate(query);
  console.log(data);
  return data;
};

module.exports = {
  locateRepo,
  getIssues,
  getSavedSearches
};
