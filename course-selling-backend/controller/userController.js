import db from "../models/database.js";
const {User,Purchase,Course} = db;
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

dotenv.config();


const userSignInController = async function (req,res){
    const {email,password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            const validate = await bcrypt.compare(password,existingUser.password);
            if(!validate) return res.status(404).json({message:"Incorrect password"});
        
                const accessToken = jwt.sign({id:existingUser._id},process.env.JWT_SECRET);
                if(!accessToken) return res.status(404).json({message:"Could not authenticate access token"});
        
                return res.json({message:"User signed in",accessToken});
        }
        return res.status(404).json({message:"Could not find user"});

    }catch(err){
        console.error("User Signin error:",err);
        return res.status(500).json({message:"Internal server error"});
    }
    
};

const userSignUpController = async function (req,res){
    const {email,password,firstName,lastName} = req.body;
    try{
        const newUser = await User.create({firstName,lastName, email,password});
        if(!newUser) return res.status(400).json({message:"Could not create new user"});
        const accessToken = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
        if(!accessToken ) return res.status(404).json({message:"Could not authenticate access token"});
        res.json({message:"User signed up",accessToken});
    } catch(err){
        console.error("User Signup error:",err)
        return res.status(500).json({message:"Internal server error"});
    }
    
};

const userGetPurchaseController = async function(req,res){
    const userId = req.userId;
    try{
        const purchases = await Purchase.find({userId: new mongoose.Types.ObjectId(userId)})
        if(!purchases) return res.status(404).json({message:"Could not find any course"});
        const courseData = await Course.find({
            _id: {$in: purchases.map(x=>x.courseId)}
        })
        
        res.json({purchases,courseData});

        
    }catch(err){
        console.error("USer get purchases error:",err)
        return res.status(500).json({message:"Internal server error"});
    }
}




export default {userSignInController,userSignUpController,userGetPurchaseController};
