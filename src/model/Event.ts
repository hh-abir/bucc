import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  venue: string;
  description: string;
  featuredImage?: string;
  type: string;
  needAttendance: boolean;
  startingDate: Date;
  endingDate: Date;
  attendance: number[];
  prId?: mongoose.Types.ObjectId;
  allowedMembers: "Any" | "BUCC Members" | "BRACU Students";
  allowedDepartments: string[];
  allowedDesignations: string[];
  notes?: string;
  registrationLink?: string;
  createdDate: Date;
  lastUpdate: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    needAttendance: {
      type: Boolean,
      default: false,
    },
    startingDate: {
      type: Date,
      required: true,
    },
    endingDate: {
      type: Date,
      required: true,
    },
    attendance: [Number],
    allowedMembers: {

      type: String,
      enum: ["Any", "BUCC Members", "BRACU Students"],
      required: true,
    },
    allowedDepartments: [
      {
        type: String,
      },
    ],
    allowedDesignations: [
      {
        type: String,
      },
    ],
    notes: {
      type: String,
      default: "",
    },
    registrationLink: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: { createdAt: "createdDate", updatedAt: "lastUpdate" },
  }
);

EventSchema.index({ title: "text" });

const Event: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
