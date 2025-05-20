import express from "express";
import mongoose from "mongoose";

const API_URL = process.env.API_URL;
const PORT = process.env.PORT;

const app = express();

app.use(express.json());

import userRoutes from "./routes/userRoutes.js";
app.use("/users",userRoutes);

import adminRoutes from "./routes/adminRoutes.js";
app.use("/admin",adminRoutes);

import courseRoutes from "./routes/courseRoutes.js";
app.use("/course",courseRoutes);


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

