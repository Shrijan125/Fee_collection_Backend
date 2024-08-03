import mongoose, { Schema } from "mongoose";

const uploadHistorySchema = new Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ResultUploadHistory = mongoose.model(
  "ResultUploadHistory",
  uploadHistorySchema
);
