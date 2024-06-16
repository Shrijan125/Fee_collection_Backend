import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  admno: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  grade: {
    type: String,
    required: true,
    enum: [
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
      "XI",
      "XII",
    ],
  },
  phone: {
    type: String,
    required: true,
    minlength: 10,
  },
  alternatePhone: {
    type: String,
    minlength: 10,
  },
  present: {
    type: Boolean,
    default: true,
  },
  dues: {
    type: ["Boolean"],
    default: [
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
      true,
    ],
  },
  description:{
    type:'String',
    default:''
  }
});

export const Student = mongoose.model("Student", studentSchema);
