import mongoose, { Schema } from "mongoose";

const examModel = new Schema(
  {
    exmcode: {
      type: String,
      required: true,
    },
    exmname: {
      type: String,
      required: true,
    },
    fullMarks: {
      type: Number,
      required: true,
    },
    subjectMarks: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["PRE", "MID", "HIGH"],
    },
  },
  { timestamps: true }
);

export const Exam = mongoose.model("Exam", examModel);
