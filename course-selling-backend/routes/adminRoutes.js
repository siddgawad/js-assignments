import express from "express";

import adminController from "../controller/adminController.js";
const {
    adminSignInController,
    adminSignUpController,
    adminCourseController,
    adminPutCourseController,
    adminGetCourseController
} = adminController;
import adminMiddleware from "../middleware/adminMiddleware.js";



const adminRouter = express.Router();



adminRouter.post("/signin", adminSignInController);

adminRouter.post("/signup",adminSignUpController);

adminRouter.post("/course",adminMiddleware,adminCourseController);

adminRouter.put("/course",adminMiddleware,adminPutCourseController);

adminRouter.post("/course/bulk",adminMiddleware,adminGetCourseController);


export default adminRouter;