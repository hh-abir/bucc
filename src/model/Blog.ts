import mongoose from "mongoose";
import "./User";

const BlogSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    default: [],
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

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
