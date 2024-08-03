import mongoose, { Schema } from "mongoose";

const adminSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  role: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
