import mongoose, { Schema } from "mongoose";

const instuFeeSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InactiveStudent",
      required: true,
    },
    annDevChrg: {
      type: Boolean,
      required: true,
    },
    examFee1: {
      type: Boolean,
      required: true,
    },
    examFee2: {
      type: Boolean,
      required: true,
    },
    statFee1: {
      type: Boolean,
      required: true,
    },
    statFee2: {
      type: Boolean,
      required: true,
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
  },
  { timestamps: true }
);

export const InAStuFeeModel = mongoose.model("InAStuFeeModel", instuFeeSchema);
