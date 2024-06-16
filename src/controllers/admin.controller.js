import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import { Fee } from "../models/fee.model.js";
import { Transaction } from "../models/transaction.model.js";
import mongoose, { get } from "mongoose";

const Login = asyncHandler(async (req, res) => {
  const { adminId, password } = req.body;
  if (!adminId || !password) {
    res.status(404);
    throw new ApiError(404, "All fields are mandatory");
  }
  const adminExists = await Admin.findOne({ adminId });
  if (!adminExists) {
    throw new ApiError(409, "Admin does not exist");
  }
  const isPasswordValid = adminExists.password === password;
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        adminId: adminExists.adminId,
        adminName: adminExists.name,
      },
      "Log In successful!"
    )
  );
});

const AddStudent = asyncHandler(async (req, res) => {
  const {
    firstName,
    admno,
    lastName,
    middleName,
    grade,
    phone,
    alternatePhone,
  } = req.body;
  if (!firstName || !admno || !grade || !phone) {
    throw new ApiError(404, "Please fill the required fields");
  }
  const studentExists = await Student.findOne({ admno });
  if (studentExists) {
    throw new ApiError(409, "Student with that admno already exists");
  }
  const createStudent = await Student.create({
    firstName,
    admno,
    lastName,
    middleName,
    grade,
    phone,
    alternatePhone,
  });
  if (createStudent) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { createStudent }, "Student created successfully")
      );
  }
  throw new ApiError(400, "Failed to create Student");
});

const getFeeStructure = asyncHandler(async (req, res) => {
  const data = await Fee.find({});
  if (data)
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Fee Structure Fetched Successfully"));
  throw new ApiError(404, "Failed to Fetch fee Structure");
});

const updateFee=asyncHandler(async(req,res)=>{
    const {grade,month,amount}=req.body;
    const findGrade=await Fee.findOneAndUpdate({grade},{$set:{[`amount.${month}`]:amount}},{new:true});
    if(!findGrade)
      throw new ApiError(404,"Failed to Update");
    return res.status(200).json(new ApiResponse(200,{},'Updated Successfully!'));
});


const getStudent=asyncHandler(async(req,res)=>
{
  const admno=req.query.admno;
  if(admno==null || admno.length==0)
  throw new ApiError(404,'Please provide the admission number');
  const studentExists=await Student.findOne({admno});
  if(studentExists)
  return res.status(200).json(new ApiResponse(200,studentExists,'Student fetched Successfully'));
  throw new ApiError(404,'Student not Found');
});

const collectFee = asyncHandler(async (req, res) => {
  const { admno, month, amount , description } = req.body;
  
  if (!admno || !month || !amount || month.length===0) {
    throw new ApiError(400, 'Please provide the mandatory fields');
  }

  if(!description)
  {
    description='';
  }

  const updateFee = await Student.findOneAndUpdate(
    { admno },
    { 
      $set: { 
        description,
      },
      $set: month.reduce((acc, index) => ({ ...acc, [`dues.${index}`]: false }), {})
    },
    { new: true }
  );

  if (!updateFee) {
    throw new ApiError(400, 'Failed to collect fee');
  }

  const createTransaction = await Transaction.create({
    student: updateFee._id,
    amount: amount,
  });

  if (!createTransaction) {
    throw new ApiError(409, 'Failed to create transaction');
  }

  return res.status(200).json(new ApiResponse(createTransaction));
});

const calculateFee=asyncHandler(async(req,res)=>{
  const months=req.query.months;
  const grade=req.query.grade;
  const currentDate=new Date();
  const currentMonth=currentDate.getMonth();
  if(!months || months.length===0  || !grade || grade.length===0)
    throw new ApiError(400,"Please provide the month and the grade");
  const getFee=await Fee.findOne({grade});
  if(!getFee)
    throw new ApiError(404,'Failed to fetch fee');
  var totalFee=0;
  var fine=0;
  if(typeof months === 'string')
  {
    if(parseInt(months) - currentMonth <= -2)
      fine=fine+100;
    if(parseInt(months)-currentMonth===-1)
      fine=fine+50;
    totalFee=totalFee+parseInt(getFee.amount[parseInt(months)]);
  }
  else
  {
  for(var i=0;i<months.length;i++)
  {
  
    if(parseInt(months[i]) - currentMonth <= -2)
      fine=fine+100;
    if(parseInt(months[i])-currentMonth===-1)
      fine=fine+50;
    totalFee=totalFee+parseInt(getFee.amount[parseInt(months[i])]);
  }
}
  totalFee=totalFee+fine;
  return res.status(200).json(new ApiResponse(200,{totalFee,fine},"Fee calculated Successfully!"));
});



export { Login, AddStudent, getFeeStructure ,updateFee,getStudent,collectFee,calculateFee};
