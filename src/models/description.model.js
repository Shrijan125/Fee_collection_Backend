import mongoose, { Schema } from "mongoose";

const descSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  description: {
    type: String,
  },
});

export const Description = mongoose.model("Description", descSchema);
