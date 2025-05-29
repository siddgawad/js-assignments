
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import userController from "../controller/userController.js";
const {userSignInController,userSignUpController,userGetPurchaseController} = userController;


const userRouter = express.Router();


    userRouter.post("/signin", userSignInController);
    
    userRouter.post("/signup",userSignUpController);
    
    userRouter.get("/purchases",authMiddleware,userGetPurchaseController);




export default userRouter;

