import mongoose from "mongoose";
import "./User";

const TestimonialSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  targetMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  relationship: {
    type: String, // e.g., "Director of R&D", "Alumni / Former President"
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: true,
  }
}, { 
  timestamps: true,
  collection: "testimonials" 
});

const Testimonial = mongoose.models.Testimonial || mongoose.model("Testimonial", TestimonialSchema);
export default Testimonial;
