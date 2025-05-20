import express from "express";
import mongoose from "mongoose";

const API_URL = process.env.API_URL;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

import adminRouter from "./routes/adminRoutes";
app.use("/api/admin",adminRouter);

import courseRouter from "./routes/courseRoutes";
app.use("/api/course",courseRouter);

import userRouter from "./routes/userRoutes";
app.use("/user",userRouter);


mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("MongoDB connected");
    app.listen(PORT,()=>{
        console.log(`Server running at ${API_URL}/${PORT}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection failed:",err.message);
});

