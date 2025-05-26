import express from "express";

const adminRouter = express.Router();



adminRouter.post("/admin/signin", (req,res)=>{
    res.json({message:"Admin signed in"});
});

adminRouter.post("/admin/signup",(req,res)=>{
    res.json({message:"Admin signed up"});
});

adminRouter.post("/admin/course",(req,res)=>{
    res.json({message:"Admin created course"});
});

adminRouter.put("/admin/course",(req,res)=>{
    res.json({message:"Admin edited course"});
});

adminRouter.post("/admin/course/bulk",(req,res)=>{
    res.json({message:"Admin gets all courses in bulk"});
});


export default adminRouter;