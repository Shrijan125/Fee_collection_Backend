import { Router } from "express";
import { AddStudent, Login } from "../controllers/admin.controller.js";

const router=Router();

router.route('/login').post(Login);
router.route('/createStudent').post(AddStudent);

export default router;
