import mongoose from "mongoose";

const VisitorLogSchema = new mongoose.Schema({
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  visitors: {
    type: Number,
    default: 0,
  },
  ips: {
    type: [String],
    default: [],
  },
});

export default mongoose.models.VisitorLog || mongoose.model("VisitorLog", VisitorLogSchema);
