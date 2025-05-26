import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


import courseRouter from "./routes/courseRoutes";
import userRouter from "./routes/userRoutes";


const PORT = process.env.PORT;
const API_URL = process.env.API_URL;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use("/user",userRouter);
app.use("/course",courseRouter);


mongoose.connect(`${MONGO_URI}`)
.then(()=>{
    app.listen(`${PORT}`, ()=>{
        console.log(`Server running at ${API_URL}/${PORT}`);
    })
})
.catch((err)=>{
    console.log("Could not connect to database:",err.message)
});