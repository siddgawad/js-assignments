import express from "express";


const userRouter = express.Router();

import loginController from "../controller/userController";
userRouter.post("/user/login", loginController);

import signupController from "../controller/userController";
userRouter.post("/user/signup",signupController);

module.exports={userRouter:userRouter};