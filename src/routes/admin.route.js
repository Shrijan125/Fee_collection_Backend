import { Router } from "express";
import {
  AddStudent,
  Login,
  calculateFee,
  collectFee,
  getFeeStructure,
  getStudent,
  updateFee,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/login").post(Login);
router.route("/createStudent").post(AddStudent);
router.route("/getFeeStructure").get(getFeeStructure);
router.route("/updateFee").put(updateFee);
router.route("/getStudent").get(getStudent);
router.route("/collectFee").post(collectFee);
router.route("/calculateFee").get(calculateFee);

export default router;
