### what is in the repo

[![Greenkeeper badge](https://badges.greenkeeper.io/saikatharryc/git-issue-node.svg)](https://greenkeeper.io/)

`/src/client` holds the code of frontend part
`/src/server` holds the code for server side [express]

#### Key points:

in server-side `helpers/issues.helper.js` file , `getIssueCount` function just finds and gives the count of issues by date.
its not capable to filter in this way:
`now - last 24hour`, `last 24hour - 1week`, `last week- more than week`.

so what we did is, we just fetched the count for last 24 hours data.
and again for `last24 hour - 1week data`, we are actually taking out the count from last `1week` and just subtracting the count for the last day i.e. `last 24 hour count` and so on.

#### internal flow:

search with `username/org name` and `reponame` >
tries to locate if there is any repo available with that > [yes > finds metadata of repo & count of different segment & saves it , no> terminates the process]>finds all the issues > [got more than 1 issue> saves issue & shows it to user by customizing , got none>does nothing]

### What we can improve

- update the structure to multipage component frontend
- detach backend from the application to run seperately
- Add option to show only time aggregated data [current;y we are showing only count]
- Add agenda/redis or some queue system, which will look after the issues in DB and change the state and other details, incase changes.
- Show Avatar and name in the Lists [currently saved in DB]
- History page can be modified with groupby system as data comes in that format roght now.
- History page can be modified to accept multi level groups. like group by User/organisation > group by repo > all issues of that repo.
- use cursor to fetch for history.
- when error happening send some notification in frontend, [error messages are coming from backend]
