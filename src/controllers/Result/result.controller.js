import asyncHandler from "express-async-handler";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { ApiError } from "../../utils/ApiError.js";
import { Exam } from "../../models/Exam/exam.model.js";
import { Student } from "../../models/student.model.js";
import { Junres } from "../../models/Result/junRes.model.js";
import mongoose from "mongoose";
import { ResultUploadHistory } from "../../models/Result/uploadHistory.model.js";

const transformKeys = (data, exam) => {
  return;
};

const createExam = asyncHandler(async (req, res) => {
  const { exmname, fullMarks, subjectMarks, category, exmcode } = req.body;
  const exam = await Exam.create({
    exmcode,
    exmname,
    category,
    fullMarks,
    subjectMarks,
  });
  if (!exam) throw new ApiError("Failed to create Exam!");
  return res
    .status(200)
    .json(new ApiResponse(200, exam, "Exam Created Sucessfully!"));
});

const examDetails = asyncHandler(async (req, res) => {
  const category = req.query.category;
  if (!category) throw new ApiError(404, "Category not found!");
  const examDetails = await Exam.find({ category });
  return res
    .status(200)
    .json(
      new ApiResponse(200, examDetails, "Exam Details fetched successfully!")
    );
});

const uploadMarks = asyncHandler(async (req, res) => {
  const { data, category, exmcode, grade } = req.body;
  if (!data || !category || !exmcode || !grade)
    throw new ApiError(400, "Please provide all the fields!");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const exam = await Exam.findOne({ exmcode, category }).session(session);
    if (!exam) throw new ApiError(404, "Exam details not found!");
    const checkUploadHistory = await ResultUploadHistory.findOne({
      exam: exam?._id,
      grade,
    }).session(session);
    if (checkUploadHistory)
      throw new ApiError(409, "Marks for this exam has already been uploaded.");

    const transformedItems = await Promise.all(
      data.map(async (item) => {
        const student = await Student.findOne({
          admno: String(item?.Admno),
        }).session(session);
        if (!student)
          throw new ApiError(
            404,
            `Student with admno ${item.admno} not found!`
          );
        for (let key in item) {
          if (
            typeof item[key] === "number" &&
            item[key] > exam?.subjectMarks &&
            key != "Admno"
          ) {
            throw new ApiError(409, `Marks exceed the maximum allowed marks.`);
          }
        }
        return {
          student: student._id,
          exam: exam._id,
          EnglishWritten: item?.EnglishWritten,
          EnglishOral: item?.EnglishOral,
          EnglishRhymes: item?.EnglishRhymes,
          HindiWritten: item?.HindiWritten,
          HindiOral: item?.HindiOral,
          HindiRhymes: item?.HindiRhymes,
          MathsWritten: item?.MathsWritten,
          MathsOral: item?.MathsOral,
          GS: item?.GS,
          Activity: item?.Activity,
          SpellDict: item?.SpellDict,
          Drawing: item?.Drawing,
          PT: item?.PT,
          Conversation: item?.Conversation,
          WorkEducation: item["Work Education"] || "",
          GeneralAwareness: item["General Awareness"] || "",
          ArtEducation: item["Art Education"] || "",
          RegularityPunctuality: item["Regularity Punctuality"] || "",
          HelPhyEd: item["Health and PhyEdu."] || "",
          Sincerity: item?.Sincerity || "",
        };
      })
    );
    const insertedData = await Junres.insertMany(transformedItems, { session });
    if (!insertedData) throw new ApiError(400, "Failed to insert Data!");

    const updateHistory = await ResultUploadHistory.create(
      [{ exam: exam?._id, grade }],
      { session }
    );
    if (!updateHistory) throw new ApiError(400, "Failed to record!");

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Marks Uploaded Successfully!"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export { createExam, examDetails, uploadMarks };
