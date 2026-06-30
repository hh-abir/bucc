import mongoose, { Schema } from "mongoose";

const AppConfigSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const AppConfig =
  mongoose.models.AppConfig || mongoose.model("AppConfig", AppConfigSchema);

export default AppConfig;
