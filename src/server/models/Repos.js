const mongoose = require("mongoose");
const RepoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    username: {
      type: String
    },
    repoName: {
      type: String
    },
    totalIssuesOpen: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);
const Repos = mongoose.model("Repos", RepoSchema);
module.exports = Repos;
