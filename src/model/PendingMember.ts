import mongoose from "mongoose";

const PendingMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  memberStatus: {
    type: String,
    required: true,
    enum: ["Active", "Alumni"],
    default: "Active",
  },
  buccDepartment: {
    type: String,
    required: true,
  },
  bracuDepartment: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
    default: "General Member",
  },
  joinedBucc: {
    type: String,
  },
  joinedBracu: {
    type: String,
  },
}, {
  timestamps: true,
  collection: "pending_members"
});

const PendingMember = mongoose.models.PendingMember || mongoose.model("PendingMember", PendingMemberSchema);

export default PendingMember;
