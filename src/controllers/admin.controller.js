import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import { Fee } from "../models/fee.model.js";
import { Transaction } from "../models/transaction.model.js";
import { InactiveStudent } from "../models/inactiveStudents.model.js";

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
    Name,
    admno,
    DOB,
    grade,
    phone,
    fathersName,
    mothersName,
    hostelFacility,
    TransportFacility,
    feeWaiver,
    Aadhar,
    Address,
    Gender,
    bloodGroup,
    alternatePhone,
  } = req.body;
  const x=req.body;
  if (
    !String(bloodGroup).trim() ||
    !String(Name).trim() ||
    !String(admno).trim() ||
    !String(grade).trim() ||
    !String(phone).trim() ||
    !String(DOB).trim() ||
    !String(fathersName).trim() ||
    !String(mothersName).trim() ||
    !String(Aadhar).trim() ||
    !String(Address).trim() ||
    !String(Gender).trim()
  ) {
    throw new ApiError(404, "Please fill the required fields");
  }

  const studentExists = await Student.findOne({ admno });
  if (studentExists) {
    throw new ApiError(409, "Student with that admno already exists");
  }

  const inactiveStudent=await InactiveStudent.findOne({admno});
  if (inactiveStudent) {
    throw new ApiError(409, "Student with that admno already exists");
  }
  const createStudent = await Student.create({
    Name,
    admno,
    DOB,
    grade,
    bloodGroup,
    phone,
    fathersName,
    mothersName,
    hostelFacility,
    TransportFacility,
    feeWaiver,
    Aadhar,
    Address,
    Gender,
    alternatePhone
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
    const {grade,ProsReg,AdmFee,AnnualCharge,TuitionFee,LabCharge,TotalFee,StationaryFee,ExamFee}=req.body;
    if(!grade || !ProsReg || !AdmFee || !AnnualCharge || !TuitionFee || !LabCharge || !TotalFee || !StationaryFee || !ExamFee)
    throw new ApiError(409,"All Fields are required");
    const findGrade=await Fee.findOneAndUpdate({grade},{$set:{ProsReg,AdmFee,AnnualCharge,TuitionFee,LabCharge,TotalFee,StationaryFee,ExamFee}});
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
  const { admno, month, amount } = req.body;
  var { description , utrNo}=req.body;

  
  if (!admno || !month || !amount || month.length===0) {
    throw new ApiError(400, 'Please provide the mandatory fields');
  }

  if(!description)
  {
    description='';
  }
  if(!utrNo)
  {
    utrNo='';
  }
  const updateFields = {
    description,
    ...month.reduce((acc, index) => ({ ...acc, [`dues.${index}`]: false }), {}),
  };

  const updateFee = await Student.findOneAndUpdate(
    { admno },
    { 
      $set: updateFields,
    },
    { new: true }
  );

  if (!updateFee) {
    throw new ApiError(400, 'Failed to collect fee');
  }

  const createTransaction = await Transaction.create({
    student: updateFee._id,
    amount: amount,
    utrNo
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

const getTodaysCollection=asyncHandler(async(req,res)=>{
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todaysTransactions = await Transaction.find({
    createdAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  }).populate('student',"-dues");
  
  if(todaysTransactions)
    return res.status(200).json(new ApiResponse(200,todaysTransactions,'Fetched transactions successfully!'));
    throw new ApiError(400,'Failed to generate transaction');
});

const deleteStudent=asyncHandler(async(req,res)=>{
  const {admno}=req.body;
  if(!admno)
    throw new ApiError(400,'Admission Number is requried');
  const studentExists=await Student.findOne({admno});
  if(!studentExists)
    throw new ApiError(404,"Student Not Found");
 
  const inactivateStudent=await InactiveStudent.create({
    admno:studentExists.admno,
    firstName:studentExists.firstName,
    middleName:studentExists.middleName,
    lastName:studentExists.lastName,
    grade:studentExists.grade,
    phone:studentExists.phone,
    alternatePhone:studentExists.alternatePhone
  });
  if(!inactivateStudent)
    throw new ApiError(409,'Failed to inactivateStudent!');

  const deleteStudent=await Student.findByIdAndDelete(studentExists._id);
  if(!deleteStudent)
    throw new ApiError(400,'Failed to delete Student');
  return res.status(200).json(new ApiResponse(200,inactivateStudent,"Student Inactivated Successfully"));
});

const getAllStudent=asyncHandler(async(req,res)=>
  {
    const admno=req.query.admno;
    var present;
    if(admno==null || admno.length==0)
    throw new ApiError(404,'Please provide the admission number');
    var studentExists=await Student.findOne({admno});
    present=true
    if(!studentExists)
    {
      studentExists=await  InactiveStudent.findOne({admno});
      present=false
    }
    if(!studentExists)
      throw new ApiError(404,'Student Not Found');
    return res.status(200).json(new ApiResponse(200,{present,studentExists},'Student fetched Successfully'));
  });
  
const updateStudent=asyncHandler(async(req,res)=>{
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
  if (!studentExists) {
    throw new ApiError(409, "Student with that admno does not exists");
  }
  const updateObj={firstName,admno,lastName,middleName,grade,phone,alternatePhone};
  const updatedStudent= await Student.findByIdAndUpdate(studentExists._id,updateObj,{new:true});
  if(!updatedStudent)
    throw new ApiError(400,'Failed to update Student');
  return res.status(200).json(updatedStudent);
});

const generateDues=asyncHandler(async(req,res)=>{
  const start=req.query.startDate;
  var end=req.query.endDate || '';
  var grade=req.query.grade || '';


  if(!start)
  throw new ApiError(404,'Starting month is required');

  const query=grade===''?{}:{grade};
  const data=await Student.find(query);
  const dues = await Promise.all(data.map(async (student) => {
    const duesUptoIndex = end==='' ? student.dues.slice(0, parseInt(start) + 1) : student.dues.slice(parseInt(start),parseInt(end)+1);
    let dueAmount = 0;
    await Promise.all(duesUptoIndex.map(async (due, index) => {
      if (due === true) {
        const feeData = await Fee.find({ grade: student.grade }).select("amount");
        
        dueAmount = end==='' ?dueAmount+ parseInt(feeData[0].amount[index]):dueAmount+parseInt(feeData[0].amount[index+parseInt(start)]);
      }
    }));
    return { firstName: student.firstName,lastName:student.lastName,middleName:student.middleName, grade: student.grade,dues: dueAmount, phone: student.phone, admno:student.admno,id:student.id };
  }));

  return res.status(200).json(new ApiResponse(200,dues,'Dues list generated!'));

});



const getCollection=asyncHandler(async(req,res)=>{
  const start=req.query.startDate || '';
  const end=req.query.endDate || '';

  if(start==='' || end==='')
  {
    throw new ApiError(400,'Please provide both start date and end date');
  }
  var startDate=new Date(start);
  var endDate=new Date(end);
  startDate.setHours(0,0,0,0);
  endDate.setHours(23, 59, 59, 999);


  const todaysTransactions = await Transaction.find({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  }).populate('student',"-dues");
  
  if(todaysTransactions)
    return res.status(200).json(new ApiResponse(200,todaysTransactions,'Fetched transactions successfully!'));
    throw new ApiError(400,'Failed to generate transaction');
});



export { Login, AddStudent, getFeeStructure ,updateFee,getStudent,collectFee,calculateFee, getTodaysCollection, deleteStudent, getAllStudent, updateStudent,generateDues, getCollection};
