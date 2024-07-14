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
  addBulkStudent,
  logout,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(Login);
router.route("/createStudent").post(verifyJWT,AddStudent);
router.route("/getFeeStructure").get(verifyJWT,getFeeStructure);
router.route("/updateFee").put(verifyJWT,updateFee);
router.route("/getStudent").get(verifyJWT,getStudent);
router.route("/collectFee").post(verifyJWT,collectFee);
router.route("/calculateFee").get(verifyJWT,calculateFee);
router.route("/gettodayscollection").get(verifyJWT,getTodaysCollection);
router.route("/inactivateStudent").post(verifyJWT,deleteStudent);
router.route("/getallstudent").get(verifyJWT,getAllStudent);
router.route("/updateStudent").put(verifyJWT,updateStudent);
router.route("/generateDues").get(verifyJWT,generateDues);
router.route("/generateCollection").get(verifyJWT,getCollection);
router.route("/getFeeDetails").get(verifyJWT,getFeeDetails);
router.route("/addBulkStudent").post(verifyJWT,addBulkStudent);
router.route("/logout").post(verifyJWT,logout);
export default router;
