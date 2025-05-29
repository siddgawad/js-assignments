
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import database from "../models/database.js";
const {Purchase,Course} = database;

const courseRouter = express.Router();

    // courseRouter.post("/purchase",authMiddleware,async function (req,res){
    //     const userId = req.userId;
    //     const courseId = req.body.courseId;
    //     const exisitngPurchase = await Purchase.findOne({userId,courseId});
    //     if(!exisitngPurchase){
    //         const purchasedCourse = await Purchase.create({userId,courseId});
    //         if(purchasedCourse) res.json({message:"User successfully bought the course"});
    //     }
    //     return res.status(404).json({message:"User has already purchased the course"});
    // });
    courseRouter.post("/purchase", authMiddleware, async function (req, res) {
        const userId = req.userId;
        const courseId = req.body.courseId;
        
        // 🔥 COPY THIS DEBUG CODE EXACTLY:
        console.log("=== DEBUG START ===");
        console.log("1. userId from middleware:", userId);
        console.log("2. courseId from body:", courseId);
        console.log("3. userId is undefined?", userId === undefined);
        console.log("4. userId is null?", userId === null);
        console.log("=== DEBUG END ===");
        
        try {
            const existingPurchase = await Purchase.findOne({userId, courseId});
            
            if (existingPurchase) {
                return res.status(400).json({message: "Already purchased"});
            }
            
            const purchasedCourse = await Purchase.create({userId, courseId});
            
            // 🔥 COPY THIS DEBUG CODE EXACTLY:
            console.log("=== SAVE DEBUG START ===");
            console.log("5. What got saved:", purchasedCourse);
            console.log("6. Saved userId:", purchasedCourse.userId);
            console.log("7. Saved courseId:", purchasedCourse.courseId);
            console.log("=== SAVE DEBUG END ===");
            
            return res.json({message: "Purchase successful"});
            
        } catch (error) {
            console.log("ERROR:", error);
            return res.status(500).json({error: error.message});
        }
    });
    
    courseRouter.get("/preview",async function(req,res){
        try{
            const courses = await Course.find({});
            if(!courses) return res.status(404).json({message:"Could not find courses"});
            return res.json({courses});
        }catch(err){
            console.error("Internal server error:",err)
            return res.status(500).json({message:"Internal Server Error"});
        }
       
    });
    


export default courseRouter;


