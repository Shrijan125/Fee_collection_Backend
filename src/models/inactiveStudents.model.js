import mongoose, { Schema } from "mongoose";

const inactivestudentSchema = new Schema(
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
    },
    mothersName: {
      type: String,
    },
    phone: {
      type: String,
    },
    alternatePhone: {
      type: String,
    },
    hostelFacility: { type: Boolean },
    TransportFacility: { type: Boolean },
    feeWaiver: { type: Boolean },

    Aadhar: { type: String }, //eliminated required
    Address: { type: String },
    Gender: { type: String, enum: ["M", "F"] },
    doa: { type: Date },
    bloodGroup: { type: String }, //eliminated required
  },
  {
    timestamps: true,
  }
);

export const InactiveStudent = mongoose.model(
  "InactiveStudent",
  inactivestudentSchema
);
