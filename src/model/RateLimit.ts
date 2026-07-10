import mongoose from "mongoose";
 
const RateLimitSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  resetAt: {
    type: Date,
    required: true,
  },
});
 
// Compound index to guarantee uniqueness per IP and API path
RateLimitSchema.index({ ip: 1, endpoint: 1 }, { unique: true });
 
// TTL index: MongoDB will automatically expire and delete the log after resetAt is reached
RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });
 
export default mongoose.models.RateLimit || mongoose.model("RateLimit", RateLimitSchema);
