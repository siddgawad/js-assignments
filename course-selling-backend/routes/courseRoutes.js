
import express from "express";

const courseRouter = express.Router();

    courseRouter.post("/purchase",(req,res)=>{
        res.json({message:"User recieved all course options to buy"});
    });
    
    courseRouter.get("/preview",(req,res)=>{
        res.json({message:"All available courses"});
    });
    


export default courseRouter;


