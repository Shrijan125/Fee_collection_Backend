import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import { Fee } from "../models/fee.model.js";
import { Transaction } from "../models/transaction.model.js";
import { InactiveStudent } from "../models/inactiveStudents.model.js";
import { StuFeeModel } from "../models/stuFee.model.js";
import { Receipt } from "../models/receipt.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Dress } from "../models/dress.model.js";
import { DressTransaction } from "../models/dressTransaction.model.js";

const excelDateToJSDate = (serial) => {
  const date = new Date((serial - 25569) * 86400 * 1000);
  const dateStr = date.toISOString().split("T")[0];
  return dateStr;
};

const transformKeys = (data) => {
  return data.map((item) => ({
    Name: item?.Name,
    admno: item?.Admno,
    DOB: new Date(excelDateToJSDate(item.DOB)),
    section: item?.Section,
    grade: item?.Class,
    bloodGroup: item["Blood Group"],
    phone: item["Phone Number"],
    fathersName: item["Father's Name"],
    mothersName: item["Mother's Name"],
    hostelFacility: item["Hostel Facility"] || false,
    TransportFacility: item["Transport Facility"] || false,
    feeWaiver: item["Fee Waiver"] || false,
    Aadhar: item?.Aadhar,
    Address: item?.Address,
    Gender: item?.Gender,
    alternatePhone: item?.AlternatePhone || null,
  }));
};

// const transformDress=(data)=>{
//   return data.map((item)=>({
    // code:item.Code,
//     name:item.Name,
//     price:item.Price,
//     quantity:item.Quantity
//   }))
// }

const transformDress=(data)=>{
  return data.map((item)=>({
    code:item.Code,
    price:item.Price,
    quantity:item.Quantity || 0
  }))
}

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
  const token = jwt.sign({ _id: adminExists._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRY,
  });
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        200,
        {
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
    section,
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
    !String(Gender).trim() ||
    !String(section).trim()
  ) {
    throw new ApiError(404, "Please fill the required fields");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const studentExists = await Student.findOne({ admno }).session(session);
    if (studentExists) {
      throw new ApiError(409, "Student with that admno already exists");
    }

    const inactiveStudent = await InactiveStudent.findOne({ admno }).session(
      session
    );
    if (inactiveStudent) {
      throw new ApiError(409, "Student with that admno already exists");
    }

    const createStudent = await Student.create(
      [
        {
          Name,
          admno,
          DOB,
          section,
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
          alternatePhone,
        },
      ],
      { session }
    );

    const createFeeDetails = await StuFeeModel.create(
      [{ student: createStudent[0]._id }],
      { session }
    );

    if (!createFeeDetails) {
      throw new ApiError(400, "Failed to create student fee details");
    }

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(
        new ApiResponse(200, { createStudent }, "Student created successfully")
      );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const getFeeStructure = asyncHandler(async (req, res) => {
  const data = await Fee.find({}).select("-_id");
  if (data)
    return res
      .status(200)
      .json(new ApiResponse(200, data, "Fee Structure Fetched Successfully"));
  throw new ApiError(404, "Failed to Fetch fee Structure");
});

const updateFee = asyncHandler(async (req, res) => {
  const {
    grade,
    ProsReg,
    AdmFee,
    AnnualCharge,
    TuitionFee,
    LabCharge,
    TotalFee,
    StationaryFee,
    ExamFee,
  } = req.body;
  if (
    !grade ||
    !ProsReg ||
    !AdmFee ||
    !AnnualCharge ||
    !TuitionFee ||
    !LabCharge ||
    !TotalFee ||
    !StationaryFee ||
    !ExamFee
  )
    throw new ApiError(409, "All Fields are required");
  const findGrade = await Fee.findOneAndUpdate(
    { grade },
    {
      $set: {
        ProsReg,
        AdmFee,
        AnnualCharge,
        TuitionFee,
        LabCharge,
        TotalFee,
        StationaryFee,
        ExamFee,
      },
    }
  );
  if (!findGrade) throw new ApiError(404, "Failed to Update");
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated Successfully!"));
});

const getStudent = asyncHandler(async (req, res) => {
  const admno = req.query.admno;
  if (admno == null || admno.length == 0)
    throw new ApiError(404, "Please provide the admission number");
  const studentExists = await Student.findOne({ admno });
  if (studentExists)
    return res
      .status(200)
      .json(
        new ApiResponse(200, studentExists, "Student fetched Successfully")
      );
  throw new ApiError(404, "Student not Found");
});

const collectFee = asyncHandler(async (req, res) => {
  const {
    admno,
    month,
    amount,
    receiptNo,
    examFee1,
    examFee2,
    statFee1,
    statFee2,
    annDevChrg,
  } = req.body;
  var { description, utrNo, lateFine, discount, dues, bankName } = req.body;
  const isExamFee1Provided = req.body.hasOwnProperty("examFee1");
  const isExamFee2Provided = req.body.hasOwnProperty("examFee2");
  const isStatFee1Provided = req.body.hasOwnProperty("statFee1");
  const isStatFee2Provided = req.body.hasOwnProperty("statFee2");
  const isAnnDevChrgProvided = req.body.hasOwnProperty("annDevChrg");

  if (
    !admno ||
    !month ||
    !amount ||
    month.length === 0 ||
    !receiptNo ||
    !isExamFee1Provided ||
    !isExamFee2Provided ||
    !isStatFee1Provided ||
    !isStatFee2Provided ||
    !isAnnDevChrgProvided
  ) {
    throw new ApiError(400, "Please provide the mandatory fields");
  }

  if (!description) {
    description = "";
  }
  if (!lateFine) lateFine = "";
  if (!discount) discount = "";
  if (!dues) dues = "";
  if (!bankName) bankName = "";
  if (!utrNo) {
    utrNo = "";
  }
  const updateFields = {
    description,
    discount,
    dues,
    examFee1,
    examFee2,
    statFee1,
    statFee2,
    annDevChrg,
    ...month.reduce(
      (acc, index) => ({ ...acc, [`MonthlyDues.${index}`]: false }),
      {}
    ),
  };
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const student = await Student.findOne({ admno }).session(session);
    if (!student) throw new ApiError(404, "Student Not found");
    const updateFee = await StuFeeModel.findOneAndUpdate(
      { student: student?._id },
      { $set: updateFields },
      { new: true }
    ).session(session);
    if (!updateFee) throw new ApiError(400, "Failed to update Fee Model");
    const addTransaction = await Transaction.create(
      [
        {
          student: student?._id,
          amount,
          utrNo,
          bankName,
          lateFine,
          discount,
          dues,
          receiptNo,
          months: month,
          description,
        },
      ],
      { session }
    );
    if (!addTransaction)
      throw new ApiError(400, "Failed to create Transaction");
    const incCount = await Receipt.findByIdAndUpdate(
      { _id: "66928724862d39bdb9e344e7" },
      { $inc: { count: 1 } },
      { new: true }
    ).session(session);
    if (!incCount) throw new ApiError(400, "Transaction failed");
    await session.commitTransaction();
    session.endSession();
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Transaction Completed"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

const addBulkStudent = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data || data.length === 0) {
    throw new ApiError(404, "Can't find any data.");
  }

  const dataToInsert = transformKeys(data);
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const insertedStudents = await Student.insertMany(dataToInsert, {
      session,
    });

    const feeDetailsPromises = insertedStudents.map((student) =>
      StuFeeModel.create([{ student: student?._id }], { session })
    );

    await Promise.all(feeDetailsPromises);

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse(200, {}, "Successful"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Failed to insert students");
  }
});

const calculateFee = asyncHandler(async (req, res) => {
  const months = req.query.months;
  const tutFee = req.query.tutfee;
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  if (!months || months.length === 0 || !tutFee || tutFee.length === 0)
    throw new ApiError(400, "Please provide the month and the tutFee");
  var totalFee = 0;
  var fine = 0;
  if (typeof months === "string") {
    const monthsPassed = currentMonth - parseInt(months);
    const daysPassed = currentDay - 10;
    if (months === "0" || months === "1") {
      if (currentYear === 2024) fine = fine + 0;
      else {
        if (monthsPassed >= 0 && daysPassed > 0) {
          fine += 50;
        }
      }
    } else {
      if (currentYear === 2024) {
        if (monthsPassed >= 0 && daysPassed > 0) {
          fine += 50;
        }
      } else {
        fine = 50;
      }
    }
    totalFee = parseInt(tutFee) + fine;
  } else {
    const daysPassed = currentDay - 10;
    var monthsPassed = 0;
    for (var i = 0; i < months.length; i++) {
      monthsPassed = currentMonth - parseInt(months[i]);
      if (months[i] === "0" || months[i] === "1") {
        if (currentYear === 2024) fine = fine + 0;
        else {
          if (monthsPassed >= 0 && daysPassed > 0) {
            fine += 50;
          }
        }
      } else {
        if (currentYear === 2024) {
          if (monthsPassed >= 0 && daysPassed > 0) {
            fine += 50;
          }
        } else {
          fine += 50;
        }
      }
    }
    totalFee = parseInt(tutFee) * months.length + fine;
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, { totalFee, fine }, "Fee calculation Suucessful")
    );
});

const getTodaysCollection = asyncHandler(async (req, res) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const todaysTransactions = await Transaction.find({
    createdAt: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  }).populate("student");

  if (todaysTransactions)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          todaysTransactions,
          "Fetched transactions successfully!"
        )
      );
  throw new ApiError(400, "Failed to generate transaction");
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { admno } = req.body;
  if (!admno) throw new ApiError(400, "Admission Number is requried");
  const studentExists = await Student.findOne({ admno });
  if (!studentExists) throw new ApiError(404, "Student Not Found");

  const inactivateStudent = await InactiveStudent.create({
    admno: studentExists.admno,
    firstName: studentExists.firstName,
    middleName: studentExists.middleName,
    lastName: studentExists.lastName,
    grade: studentExists.grade,
    phone: studentExists.phone,
    alternatePhone: studentExists.alternatePhone,
  });
  if (!inactivateStudent)
    throw new ApiError(409, "Failed to inactivateStudent!");

  const deleteStudent = await Student.findByIdAndDelete(studentExists._id);
  if (!deleteStudent) throw new ApiError(400, "Failed to delete Student");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        inactivateStudent,
        "Student Inactivated Successfully"
      )
    );
});

const getAllStudent = asyncHandler(async (req, res) => {
  const admno = req.query.admno;
  var present;
  if (admno == null || admno.length == 0)
    throw new ApiError(404, "Please provide the admission number");
  var studentExists = await Student.findOne({ admno });
  present = true;
  if (!studentExists) {
    studentExists = await InactiveStudent.findOne({ admno });
    present = false;
  }
  if (!studentExists) throw new ApiError(404, "Student Not Found");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { present, studentExists },
        "Student fetched Successfully"
      )
    );
});

const updateStudent = asyncHandler(async (req, res) => {
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
  const updateObj = {
    firstName,
    admno,
    lastName,
    middleName,
    grade,
    phone,
    alternatePhone,
  };
  const updatedStudent = await Student.findByIdAndUpdate(
    studentExists._id,
    updateObj,
    { new: true }
  );
  if (!updatedStudent) throw new ApiError(400, "Failed to update Student");
  return res.status(200).json(updatedStudent);
});

const generateDues = asyncHandler(async (req, res) => {
  const { startDate, endDate, grade = "" } = req.query;

  if (!startDate || !endDate)
    throw new ApiError(404, "Starting and Ending month is required");

  const data = await StuFeeModel.find().populate("student");
  const studentsFiltered = grade
    ? data.filter((student) => student.student.grade === grade)
    : data;

  const feeData = await Fee.find().select("grade TuitionFee LabCharge");
  const feeMap = feeData.reduce((acc, fee) => {
    acc[fee.grade] = parseInt(fee.TuitionFee) + parseInt(fee.LabCharge);
    return acc;
  }, {});

  const start = parseInt(startDate);
  const end = parseInt(endDate);

  const dues = studentsFiltered.map((student) => {
    const duesUptoIndex = student.MonthlyDues.slice(start, end + 1);
    const dueAmount = duesUptoIndex.reduce(
      (acc, due) => (due ? acc + feeMap[student.student.grade] : acc),
      0
    );
    return {
      Name: student.student.Name,
      grade: student.student.grade,
      dues: dueAmount,
      phone: student.student.phone,
      admno: student.student.admno,
      id: student._id,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, dues, "Dues list generated!"));
});

const getCollection = asyncHandler(async (req, res) => {
  const start = req.query.startDate || "";
  const end = req.query.endDate || "";

  if (start === "" || end === "") {
    throw new ApiError(400, "Please provide both start date and end date");
  }
  var startDate = new Date(start);
  var endDate = new Date(end);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  const todaysTransactions = await Transaction.find({
    createdAt: {
      $gte: startDate,
      $lt: endDate,
    },
  }).populate("student");

  if (todaysTransactions)
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          todaysTransactions,
          "Fetched transactions successfully!"
        )
      );
  throw new ApiError(400, "Failed to generate transaction");
});

const getFeeDetails = asyncHandler(async (req, res) => {
  const admno = req.query.admno;
  if (admno == null || admno.length == 0)
    throw new ApiError(404, "Please provide the admission number");
  const studentExists = await Student.findOne({ admno });
  if (!studentExists) throw new ApiError(404, "Student not Found");
  var findFeeDetails = await StuFeeModel.findOne({
    student: studentExists?._id,
  }).populate("student");
  if (!findFeeDetails) throw new ApiError(409, "Something went wrong");
  const getFees = await Fee.findOne({ grade: studentExists?.grade });
  if (!getFees) throw new ApiError(400, "Failed to get Fees");
  const receiptNumber = await Receipt.findOne({
    _id: "66928724862d39bdb9e344e7",
  });
  if (!receiptNumber) throw new ApiError(400, "Falied to get receipt number");
  const data = { findFeeDetails, getFees, receiptNumber };
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Fee Details Fetched Successfully!"));
});

const logout = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const getDressDetails = asyncHandler(async (req, res) => {
  const dress = await Dress.find({}).select("-_id -__v");
  if (!dress) throw new ApiError(400, "Failed to get dress details");
  return res.status(200).json(new ApiResponse(200, dress, "Dress Details!"));
});

const updateDressDetails=asyncHandler(async(req,res)=>{
  const {name,price,quantity}=req.body;
  const dress=await Dress.findOneAndUpdate({name},{
    $set:{
      price,
      quantity
    }
  });
  if(!dress)
    throw new ApiError(400,'Failed to update');
  return res.status(200).json(new ApiResponse(200,{},'Update Successful!'));
});

// const createBulkDress=asyncHandler(async(req,res)=>{
//   const data = req.body;
//   if (!data || data.length === 0) {
//     throw new ApiError(404, "Can't find any data.");
//   }
//   const dataToInsert=transformDress(data);
//   const insertedData=await Dress.insertMany(dataToInsert);
//   if(!insertedData)
//     throw new ApiError(400,'Failed to update data');
//   return res.status(200).json(new ApiResponse(200,{},'Data entered Successfully!'));
// });


const updateDressDetailsBulk = asyncHandler(async (req, res) => {
  const data = req.body;
  if (!data || data.length === 0) {
    throw new ApiError(404, "Can't find any data.");
  }
  const dataToUpdate = transformDress(data);

  const bulkOperations = dataToUpdate.map(item => {
    const update = { $inc: { quantity: item.quantity } };

    if (item.price !== undefined) {
      update.$set = { price: item.price };
    }

    return {
      updateOne: {
        filter: { code: item.code },
        update: update
      }
    };
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await Dress.bulkWrite(bulkOperations, { session });

    if (!result) {
      throw new ApiError(400, 'Failed to update data');
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse(200, {}, 'Data Updated Successfully!'));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(400, 'Transaction failed', error);
  }
});

const calculateDressPayment=asyncHandler(async(req,res)=>{
  const code=req.query.code;
  const quantity=req.query.quantity;
  const parsedQuantity = parseInt(quantity);
  if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
    throw new ApiError(400, 'Invalid quantity provided');
  }
  if(!code || !quantity)
    throw new ApiError(400,'Please provide the required fields');
  const dressDetails=await Dress.findOne({code});
  if(!dressDetails) 
    throw new ApiError(404,'Dress Not Found');
  const amount=parsedQuantity*dressDetails.price;
  return res.status(200).json(new ApiResponse(200,amount,'Amount calculated Successfully'));
});

const getDressReceipt = asyncHandler(async (req, res) => {
  const receiptNo = await Receipt.findById('66a39f4ebafe090ed82ee3aa');
  if (!receiptNo) {
    throw new ApiError(404, 'Receipt No. not found');
  }
  return res.status(200).json(new ApiResponse(200, receiptNo, 'Receipt No. fetched successfully!'));
});



const collectDressPayment = asyncHandler(async (req, res) => {
  const { code, quantity, phone, name, receiptNo, amount } = req.body;
  if (!code || !quantity || !phone || !name || !receiptNo || !amount)
    throw new ApiError(400, 'Please provide the mandatory fields');

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const updateStock = await Dress.findOneAndUpdate(
      { code },
      { $inc: { quantity: -parseInt(quantity) } },
      { new: true, session }
    );

    if (!updateStock)
      throw new ApiError(404, 'Failed to update!');

    const incCount = await Receipt.findByIdAndUpdate(
      { _id: "66a39f4ebafe090ed82ee3aa" },
      { $inc: { count: 1 } },
      { new: true, session }
    );

    if (!incCount)
      throw new ApiError(400, 'Failed to increment receipt number');

    const createTransaction = await DressTransaction.create(
      [{
        amount,
        dress: updateStock?._id,
        name,
        phone,
        quantity,
        receiptNo,
      }],
      { session }
    );

    if (!createTransaction)
      throw new ApiError(400, 'Failed to create Transaction');

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse(200, {}, 'Transaction Successful!'));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});



export {
  Login,
  AddStudent,
  getFeeStructure,
  updateFee,
  getStudent,
  collectFee,
  calculateFee,
  getTodaysCollection,
  deleteStudent,
  getAllStudent,
  updateStudent,
  generateDues,
  getCollection,
  getFeeDetails,
  addBulkStudent,
  logout,
  getDressDetails,
  updateDressDetails,
  updateDressDetailsBulk,
  collectDressPayment,
  calculateDressPayment,
  getDressReceipt
};
