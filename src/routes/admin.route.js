import { Router } from "express";
import {
  AddStudent,
  Login,
  calculateFee,
  collectFee,
  deleteStudent,
  generateDues,
  getAllStudent,
  getCollection,
  getFeeStructure,
  getStudent,
  getTodaysCollection,
  updateFee,
  updateStudent,
  getFeeDetails,
  addBulkStudent
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/login").post(Login);
router.route("/createStudent").post(AddStudent);
router.route("/getFeeStructure").get(getFeeStructure);
router.route("/updateFee").put(updateFee);
router.route("/getStudent").get(getStudent);
router.route("/collectFee").post(collectFee);
router.route("/calculateFee").get(calculateFee);
router.route("/gettodayscollection").get(getTodaysCollection);
router.route("/inactivateStudent").post(deleteStudent);
router.route("/getallstudent").get(getAllStudent);
router.route("/updateStudent").put(updateStudent);
router.route("/generateDues").get(generateDues);
router.route("/generateCollection").get(getCollection);
router.route("/getFeeDetails").get(getFeeDetails);
router.route("/addBulkStudent").post(addBulkStudent);
export default router;
