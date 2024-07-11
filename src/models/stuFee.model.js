import mongoose, { Schema } from "mongoose";

const stuFeeSchema=new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      
});