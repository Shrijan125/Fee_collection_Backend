import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema({
  admno: {
    type: String,
    required: true,
    unique: true,
  },
  Name: {
    type: String,
    required: true,
  },
  DOB:{
    type:Date,
    required:true,
  },
  grade: {
    type: String,
    required: true,
    enum: [
      "Pre-Nur",
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
      "XI",
      "XII",
    ],
  },
  profile:{
    type:String,
  },
  fathersName:{
    type:String,
    required:true,
  },
  mothersName:{
    type:String,
    required:true
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
  hostelFacility:{type:Boolean,default:false},
  TransportFacility:{type:Boolean,default:false},
  feeWaiver:{type:Boolean,default:false},
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
  Aadhar:{type:String,required:true},
  Address:{type:String,required:true},
  Gender:{type:String,required:true,enum: [
    'M','F'
  ],},
  prevDues:{type:String,default:'0'},
  bloodGroup:{type:String,required:true},
  description: {
    type: String,
    default: "",
  },
},{
  timestamps: { createdAt: true, updatedAt: false }
});

export const Student = mongoose.model("Student", studentSchema);
