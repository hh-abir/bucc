import mongoose from "mongoose";

const PreRegMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^(?:[0-9]{8}|[0-9]{10})$/.test(v);
      },
      message: (props: { value: any }) =>
        `${props.value} is not a valid student ID!`,
    },
  },
  email: {
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
  joinedSemester: {
    type: String,
    required: true,
  },
  joinedYear: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
});

const PreRegMember =
  mongoose.models.PreRegMember ||
  mongoose.model("PreRegMember", PreRegMemberSchema);

export default PreRegMember;
