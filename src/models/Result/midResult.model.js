import mongoose, { Schema } from "mongoose";
const grade = ["A", "B", "C", ""];

const midResSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    English: {
      type: Number,
      default: -100,
    },
    Hindi: {
      type: Number,
      default: -100,
    },
    Mathematics: {
      type: Number,
      default: -100,
    },
    Science: {
      type: Number,
      default: -100,
    },
    SocialScience: {
      type: Number,
      default: -100,
    },
    Computer: {
      type: Number,
      default: -100,
    },
    GK: {
      type: Number,
      default: -100,
    },
    ValueEdu: {
      type: Number,
      default: -100,
    },
    Sanskrit: {
      type: Number,
      default: -100,
    },
    WorkEducation: {
      type: String,
      default: "",
      enum: grade,
    },
    GeneralAwareness: {
      type: String,
      default: "",
      enum: grade,
    },
    ArtEducation: {
      type: String,
      default: "",
      enum: grade,
    },
    RegularityPunctuality: {
      type: String,
      default: "",
      enum: grade,
    },
    HelPhyEd: {
      type: String,
      default: "",
      enum: grade,
    },
    Sincerity: {
      type: String,
      default: "",
      enum: grade,
    },
  },
  { timestamps: true }
);

export const MidRes = mongoose.model("MidRes", midResSchema);
