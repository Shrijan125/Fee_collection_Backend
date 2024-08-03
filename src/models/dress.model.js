import mongoose, { Schema } from "mongoose";

const dressSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 0,
  },
});

export const Dress = mongoose.model("Dress", dressSchema);
