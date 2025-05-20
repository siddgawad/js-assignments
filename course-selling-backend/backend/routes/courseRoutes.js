import express from "express";

const courseRouter = express.Router();

import { getAllCoursesController } from "../controller/CourseController";
courseRouter.get("/course/",getAllCoursesController);

import { getAllPurchasedCoursesController } from "../controller/CourseController";
courseRouter.get("/course/purchased",getAllPurchasedCoursesController);

import { purchaseCourseController } from "../controller/CourseController";
courseRouter.post("/course/purchasecourse",purchaseCourseController);

module.exports = {courseRouter:courseRouter};