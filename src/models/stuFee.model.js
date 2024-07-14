import mongoose, { Schema } from "mongoose";

const stuFeeSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  annDevChrg: {
    type: Boolean,
    default: false,
  },
  examFee1: {
    type: Boolean,
    default: false,
  },
  examFee2: {
    type: Boolean,
    default: false,
  },
  statFee1: {
    type: Boolean,
    default: false,
  },
  statFee2: {
    type: Boolean,
    default: false,
  },
  discount: {
    type: String,
    default: "",
  },
  dues: {
    type: String,
    default: "",
  },
  MonthlyDues: {
    type: ["Boolean"],
    default: [true, true, true, true, true, true, true, true, true, true],
  },
  description: {
    type: String,
    default: "",
  },
});

export const StuFeeModel = mongoose.model("StuFeeModel", stuFeeSchema);
