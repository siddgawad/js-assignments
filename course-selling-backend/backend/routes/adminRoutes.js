import express from "express";

const adminRouter = express.Router();

import adminLoginController from "";
adminRouter.post("/admin/login",adminLoginController);

import adminSignUpController from "";
adminRouter.post("/admin/signup",adminSignUpController);
