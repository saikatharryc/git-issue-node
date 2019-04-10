const mongoose = require("mongoose");
const RepoSchema = new mongoose.Schema(
  {
    repoId: {
      type: String,
      required: true
    },
    repoName: {
      type: String
    },
    totalIssuesOpen: {
      type: Number
    },
    ownerMeta: {
      avatar_url: String,
      name: String //login
      //...name and type all those can go here
    }
  },
  {
    timestamps: true
  }
);
const Repos = mongoose.model("Repos", RepoSchema);
module.exports = Repos;
