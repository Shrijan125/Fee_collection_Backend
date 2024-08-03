import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    admno: {
      type: String,
      unique: true,
    },
    Name: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
    },
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
    }, //eliminated 11th and 12th class
    section: {
      type: String,
    },
    profile: {
      type: String,
    },
    fathersName: {
      type: String,
      required: true,
    },
    mothersName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      minlength: 10,
      maxlength: 10,
      required: true,
    },
    alternatePhone: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },
    hostelFacility: { type: Boolean, default: false },
    TransportFacility: { type: Boolean, default: false },
    feeWaiver: { type: Boolean, default: false },

    Aadhar: { type: String }, //eliminated required
    Address: { type: String, required: true },
    Gender: { type: String, enum: ["M", "F"], required: true },

    bloodGroup: { type: String }, //eliminated required
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Student = mongoose.model("Student", studentSchema);
