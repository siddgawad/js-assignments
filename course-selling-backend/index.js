import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRoutes";

const app = express.json();

app.use("/user",userRouter);


