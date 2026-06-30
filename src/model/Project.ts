import mongoose, { Schema, Document } from "mongoose";
import "./User";

export interface IProject extends Document {
  title: string;
  slug: string;
  coverImage: string;
  shortDescription: string;
  fullDescription: string; // JSON string from BlockNote
  deploymentLink?: string;
  sourceCodeLink?: string;
  techStack: string[];
  author: mongoose.Types.ObjectId;
  contributors?: mongoose.Types.ObjectId[];
  status: "pending" | "approved" | "rejected";
  isFeatured?: boolean;
  lastEditedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [200, "Short description cannot exceed 200 characters"],
    },
    fullDescription: {
      type: String,
      required: [true, "Full project description is required"],
    },
    deploymentLink: {
      type: String,
      trim: true,
    },
    sourceCodeLink: {
      type: String,
      trim: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contributors: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    lastEditedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from title before saving
ProjectSchema.pre("validate", function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }
  next();
});

const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
