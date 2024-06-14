import asyncHandler from 'express-async-handler';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Admin } from '../models/admin.model.js';
import Student from '../models/student.model.js';

const Login = asyncHandler(async(req,res)=>{
    const {adminId,password}=req.body;
    if(!adminId || !password)
    {
        res.status(404);
        throw new ApiError(404,'All fields are mandatory');
    }
    const adminExists=await Admin.findOne({adminId});
    if(!adminExists)
    {
        throw new ApiError(409,'Admin does not exist');
    }
    const isPasswordValid= (adminExists.password===password);
    if(!isPasswordValid)
    {
        throw new ApiError(401,'Invalid credentials');
    }
    return res.status(200).json(new ApiResponse(200,{
        'adminId': adminExists.adminId,
        'adminName':adminExists.name
    },'Log In successful!'));
});

const AddStudent=asyncHandler(async(req,res)=>{
    const {firstName,admno,lastName,middleName,grade,phone,altenatePhone}=req.body;
    if(!firstName || !admno || !grade || !phone)
    {
        throw new ApiError(404,'Please fill the required fields');
    }
    const studentExists=await Student.findOne({admno});
    if(studentExists)
    {
            throw new ApiError(409,'Student with that admno already exists');
    }
    const createStudent=await Student.create({
        firstName,
        admno,
        lastName,
        middleName,
        grade,
        phone,
        altenatePhone
    });
    if(createStudent)
    {
        return res.status(200).json(new ApiResponse(200,{createStudent},'Student created successfully'));
    }
    return new ApiError(400,'Failed to create Student');
});

export {Login,AddStudent};