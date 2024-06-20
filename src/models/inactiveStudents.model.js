import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  admno: {
    type: String,
    required: true,
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
});

export const InactiveStudent = mongoose.model("InactiveStudent", studentSchema);
