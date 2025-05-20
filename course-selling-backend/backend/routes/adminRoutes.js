import express from "express";

const adminRouter = express.Router();

import adminLoginController from "";
adminRouter.post("/admin/login",adminLoginController);

import adminSignUpController from "";
adminRouter.post("/admin/signup",adminSignUpController);

adminRouter.post("/course",adminCourseController);

adminRouter.put("/course",adminCourseEditController);

adminRouter.get("/course/bulk",adminGetAllCoursesController);

module.exports = {adminRouter: adminRouter};