import mongoose, { Schema } from "mongoose";

const dressTSchema = new Schema(
  {
    amount: {
      type: String,
      required: true,
    },
    receiptNo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dress",
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const DressTransaction = mongoose.model(
  "DressTransaction",
  dressTSchema
);
