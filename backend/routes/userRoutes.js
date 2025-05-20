import express from "express";

const userRouter = express.Router();

import loginController from "";
userRouter.post("/users/login", loginController);

import signupController from "";
userRouter.post("/users/signup",signupController);

