
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import userController from "../controller/userController.js";
const {userSignInController,userSignUpController,userPurchaseController} = userController;


const userRouter = express.Router();


    userRouter.post("/signin", userSignInController);
    
    userRouter.post("/signup",userSignUpController);
    
    userRouter.post("/purchases",authMiddleware,userPurchaseController);




export default userRouter;

