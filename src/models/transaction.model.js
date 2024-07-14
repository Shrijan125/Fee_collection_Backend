import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    utrNo: {
      type: String,
      default: "",
    },
    bankName: {
      type: String,
      default: "",
    },
    lateFine: {
      type: String,
      default: "0",
    },
    discount: {
      type: String,
      default: "0",
    },
    dues: {
      type: String,
      default: "0",
    },
    receiptNo: {
      type: String,
      required: true,
    },
    months: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
