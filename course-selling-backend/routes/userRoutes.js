
import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import userSignInController from "../controller/userController.js";
import userSignUpController from "../controller/userController.js"

const userRouter = express.Router();


    userRouter.post("/signin", userSignInController);
    
    userRouter.post("/signup",userSignUpController);
    
    userRouter.post("/purchases",authMiddleware,(req,res)=>{
        const userId = req.userId;
        res.json({message:"User purchased course"});
    });




export default userRouter;

