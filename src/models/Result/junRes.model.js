import mongoose, { Schema } from "mongoose";
const grade = ["A", "B", "C", ""];

const junResSchema = new Schema(
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
    EnglishWritten: {
      type: Number,
      default: -100,
    },
    EnglishOral: {
      type: Number,
      default: -100,
    },
    EnglishRhymes: {
      type: Number,
      default: -100,
    },
    HindiWritten: {
      type: Number,
      default: -100,
    },
    HindiOral: {
      type: Number,
      default: -100,
    },
    HindiRhymes: {
      type: Number,
      default: -100,
    },
    MathsWritten: {
      type: Number,
      default: -100,
    },
    MathsOral: {
      type: Number,
      default: -100,
    },
    GS: {
      type: Number,
      default: -100,
    },
    Activity: {
      type: Number,
      default: -100,
    },
    SpellDict: {
      type: Number,
      default: -100,
    },
    Drawing: {
      type: Number,
      default: -100,
    },
    PT: {
      type: Number,
      default: -100,
    },
    Conversation: {
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

export const Junres = mongoose.model("Junres", junResSchema);
