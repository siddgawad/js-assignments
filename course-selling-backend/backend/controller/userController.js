
import { User } from "../models/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const loginController = async function(req,res){
    
        const {email,password} = req.body;
        if(!email||!password) return res.status(400).json({message:"Enter valid username and password"});
try{
    const existingUser = await User.findOne({email});
    if(!existingUser) return res.status(404).json({message:"User does not exist"});
    const validate = await bcrypt.compare(this.password,existingUser.password);

    if(validate){
        const userId = existingUser._id;
        const accessToken = jwt.verify({userId},process.env.JWT_SECRET);
        return res.status(200).json({message:"Sucessfully logged in",accessToken});
    }
    return res.status(403).json({message:"Incorrect password"});
    
}
    catch(err){
        console.log("Failed to check for user in database");
        return res.status(500).json({message:"Internal Server Error:",err});
    }

}

const signupController = async function(req,res){
    const {email,password,firstName,lastName} = req.body;
        if(!username||!password) return res.status(400).json({message:"Enter valid username and password"});
        try{
            const existingUser = await User.findOne({email});
    if(existingUser) return res.status(404).json({message:"User already exist"});
    const newUser = await User.create({email,password,firstName,lastName});
    const userId = newUser._id;
    const accessToken = jwt.sign({userId},process.env.JWT_SECRET);
    if(newUser) return res.status(201).json({message:"Successfully created new user",accessToken});
        }catch(err){
            console.log("Failed to check create user in database");
        return res.status(500).json({message:"Internal Server Error:",err});

        }

}

module.exports={loginController:loginController,signupController:signupController};