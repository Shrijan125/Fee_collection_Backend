import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import expressAsyncHandler from "express-async-handler";
import AdminRoute from './admin.route.js'

const router=Router();

router.route('/').get((req,res)=>{
return res.status(200).json(new ApiResponse(200,{},'Healthy'));
});

router.use('/admin',AdminRoute);

export default router;