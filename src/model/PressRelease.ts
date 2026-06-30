import mongoose from "mongoose";
import "./User";

const PressReleaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  featuredImage: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  author: {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    authorName: {
      type: String,
    },
    authorEmail: {
      type: String,
    },
    authorDesignation: {
      type: String,
    },
    authorDepartment: {
      type: String,
    },
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "draft",
    enum: ["draft", "pending", "published"],
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

const PressRelease = mongoose.models.PressRelease || mongoose.model("PressRelease", PressReleaseSchema);

export default PressRelease;
