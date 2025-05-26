import express from "express";

const userRouter = express.Router();

userRouter.post("user/login", (req,res)=>{
    res.json("USer signed in");
});

userRouter.post("user/signup",(req,res)=>{
    res.json("User signed up");
});

userRouter.post("user/purchase",(req,res)=>{
    res.json("User purchased course");
});

userRouter.get("user/course",(req,res)=>{
    res.json("User recieved all courses option");
});

userRouter.get("user/purchased/course",(req,res)=>{
    res.json("User recived purchased course");
});

export default userRouter;
