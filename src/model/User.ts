import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  designation: {
    type: String,
    required: true,
    default: "General Member",
  },
  buccDepartment: {
    type: String,
    required: true,
  },
  bracuDepartment: {
    type: String,
    required: true,
  },
  memberStatus: {
    type: String,
    required: true,
    default: "Active",
    enum: ["Active", "Inactive", "Alumni"],
  },
  personalEmail: {
    type: String,
  },
  joinedBracu: {
    type: String,
  },
  joinedBucc: {
    type: String,
  },
  birthDate: {
    type: Date,
  },
  bloodGroup: {
    type: String,
  },
  gender: {
    type: String,
  },
  emergencyContact: {
    type: String,
  },
  lastPromotion: {
    type: String,
  },
  memberSkills: {
    type: [String],
    default: [],
  },
  memberSocials: {
    type: mongoose.Schema.Types.Mixed, 
  },
  profileSlug: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
  },
  isPublicProfile: {
    type: Boolean,
    default: false,
  },
  bio: {
    type: String,
  },
  currentJob: {
    type: String,
  },
  cvLink: {
    type: String,
  },
  showPersonalEmail: {
    type: Boolean,
    default: false,
  },
  showPhoneNumber: {
    type: Boolean,
    default: false,
  },
  showProjects: {
    type: Boolean,
    default: true,
  },
  showBlogs: {
    type: Boolean,
    default: true,
  },
  showTestimonials: {
    type: Boolean,
    default: true,
  },
  coverImage: {
    type: String,
  },
  experience: {
    type: String,
  },
  recentActivity: {
    type: String,
  },
  showExperience: {
    type: Boolean,
    default: true,
  },
  showRecentActivity: {
    type: Boolean,
    default: true,
  },
  education: {
    type: String,
  },
  achievements: {
    type: String,
  },
  certifications: {
    type: String,
  },
  showEducation: {
    type: Boolean,
    default: true,
  },
  showAchievements: {
    type: Boolean,
    default: true,
  },
  showCertifications: {
    type: Boolean,
    default: true,
  },
  showGithubStats: {
    type: Boolean,
    default: true,
  },
  modifiedBy: {
    type: String,
  }
}, { 
  timestamps: true,
  collection: 'user' // Reverted to match Better Auth default
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
