import express from "express";
import adminSignUpController from "../controller/adminController.js";
import adminSignInController from "../controller/adminController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import adminCourseController from "../controller/adminController.js";
import adminPutCourseController from "../controller/adminController.js";
import adminGetCourseController from "../controller/adminController.js";


const adminRouter = express.Router();



adminRouter.post("/signin", adminSignInController);

adminRouter.post("/signup",adminSignUpController);

adminRouter.post("/course",adminMiddleware,adminCourseController);

adminRouter.put("/course",adminMiddleware,adminPutCourseController);

adminRouter.post("/course/bulk",adminMiddleware,adminGetCourseController);


export default adminRouter;