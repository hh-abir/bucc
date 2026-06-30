import mongoose from "mongoose";

const GlobalBannerSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    default: "Flash Event: Tech Talk & Networking Session tonight at 6:00 PM.",
  },
  link: {
    type: String,
    default: "/events",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastUpdatedBy: {
    type: String,
  }
}, { 
  timestamps: true 
});

const GlobalBanner = mongoose.models.GlobalBanner || mongoose.model("GlobalBanner", GlobalBannerSchema);

export default GlobalBanner;
