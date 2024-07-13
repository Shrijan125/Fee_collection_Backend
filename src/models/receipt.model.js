import mongoose, { Schema } from "mongoose";

const receiptSchema = new Schema({
  count: {
    type: Number,
    default: 1,
  },
});

export const Receipt = new mongoose.model("Receipt", receiptSchema);
