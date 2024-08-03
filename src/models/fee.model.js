import mongoose, { Schema } from "mongoose";

const feeSchema = new Schema({
  grade: {
    type: String,
    required: true,
    enum: [
      "Nur",
      "KG-I",
      "KG-II",
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "VII",
      "VIII",
      "IX",
      "X",
    ],
  },
  ProsReg: {
    type: String,
    required: true,
  },
  AdmFee: {
    type: String,
    required: true,
  },
  AnnualCharge: {
    type: String,
    required: true,
  },
  TuitionFee: {
    type: String,
    required: true,
  },
  LabCharge: {
    type: String,
    default: "0",
  },
  TotalFee: {
    type: String,
    required: true,
  },
  StationaryFee: {
    type: String,
    default: "0",
  },
  ExamFee: {
    type: String,
    default: "0",
  },
});

export const Fee = mongoose.model("Fee", feeSchema);
