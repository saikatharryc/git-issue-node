const mongoose = require("mongoose");
const IssueSchema = new mongoose.Schema(
  {
    repo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repos",
      required: true
    },
    issueTitle: {
      type: String
    },
    body: {
      type: String
    },
    title: {
      type: String
    },
    number: {
      type: Number
    },
    opendAt: {
      type: Date //created_at
    }
  },
  {
    timestamps: true
  }
);
const Issues = mongoose.model("Issues", IssueSchema);
module.exports = Issues;
