import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {

      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const findAdmin = await Admin.findById(decodedToken?._id).select(
      "-password -adminId"
    );
    if (!findAdmin) {

      throw new ApiError(401, "Invalid Access Token");
    }
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
