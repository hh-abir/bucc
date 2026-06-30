import mongoose from "mongoose";

const EvaluationDataSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  bracuDepartment: {
    type: String,
    required: true,
  },
  buccDepartment: {
    type: String,
    required: true,
  },
  responseObject: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  submissionDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Submitted", "Accepted", "Rejected"],
  },
  interviewTakenBy: {
    type: [String],
    default: [],
  },
  comment: {
    type: String,
    default: "",
  },
  modifiedBy: {
    type: String,
  },
});

const EvaluationData =
  mongoose.models.EvaluationData ||
  mongoose.model("EvaluationData", EvaluationDataSchema);

export default EvaluationData;
