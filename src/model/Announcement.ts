import mongoose from "mongoose";
import "./User";

const AnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Support for BlockNote JSON or plain text
    required: true,
  },
  author: {
    name: String,
    designation: String,
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
}, { 
  timestamps: true 
});

const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);

export default Announcement;
