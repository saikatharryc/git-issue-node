const mongoose = require("mongoose");
const upsertMany = require("@meanie/mongoose-upsert-many");

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
IssueSchema.plugin(upsertMany);
const Issues = mongoose.model("Issues", IssueSchema);
module.exports = Issues;
