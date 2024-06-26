import { intakeInfo } from "@/constants/buccInfo";
import mongoose, { Schema } from "mongoose";

const MemberSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,

  name: {
    type: String,
    required: [true, "Please provide a name"],
  },

  studentId: {
    type: String,
    required: true,
  },

  email: {
    //G-Suite Email
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/,
      "Please use a valid BRACU G-Suite email address",
    ],
  },

  buccDepartment: {
    type: String,
    enum: [
      "ADVISORS BODY",
      "GOVERNING BODY",
      "COMMUNICATION AND MARKETING",
      "CREATIVE",
      "EVENT MANAGEMENT",
      "FINANCE",
      "HUMAN RESOURCES",
      "PRESS RELEASE AND PUBLICATIONS",
      "RESEARCH AND DEVELOPMENT",
    ],
    required: true,
  },

  designation: {
    type: String,
    enum: [
      "ADVISOR",
      "ALUMNI",
      "PRESIDENT",
      "VICE PRESIDENT",
      "GENERAL SECRETARY",
      "TREASURER",
      "DIRECTOR",
      "ASSISTANT DIRECTOR",
      "SENIOR EXECUTIVE",
      "EXECUTIVE",
      "GENERAL MEMBER",
    ],
    required: true,
    default: "GENERAL MEMBER",
  },

  personalEmail: {
    type: String,
    required: false,
  },

  contactNumber: {
    type: String,
    required: false,
  },

  joinedBracu: {
    type: String,
    required: false,
  },

  departmentBracu: {
    type: String,
    required: false,
  },

  profileImage: {
    type: String,
    required: false,
  },

  rfid: {
    type: String,
    required: false,
  },

  birthDate: {
    type: Date,
    required: false,
  },

  bloodGroup: {
    type: String,
    required: false,
  },

  gender: {
    type: String,
    required: false,
    enum: ["MALE", "FEMALE", "OTHER"],
  },

  emergencyContact: {
    type: String,
    required: false,
  },

  joinedBucc: {
    type: String,
    required: false,
    default: intakeInfo.intakeName,
  },

  lastPromotion: {
    type: String,
    required: false,
  },

  memberStatus: {
    type: String,
    required: false,
    default: "Active",
    enum: ["Active", "Inactive", "Graduated", "Terminated"],
  },

  memberSkills: {
    type: [String],
    required: false,
  },

  //membersociocials will contain objects of social media links
    memberSocials: {
    type: Object,
    required: false
    }
});

const MemberInfo =
  mongoose.models.MemberInfo || mongoose.model("MemberInfo", MemberSchema);
export default MemberInfo;
