
import express from "express";

const userRouter = express.Router();


    userRouter.post("/user/signin", (req,res)=>{
        res.json({message:"User signed in"});
    });
    
    userRouter.post("/user/signup",(req,res)=>{
        res.json({message:"User signed up"});
    });
    
    userRouter.post("/user/purchases",(req,res)=>{
        res.json({message:"User purchased course"});
    });




export default userRouter;

