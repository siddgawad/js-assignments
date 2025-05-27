
// REPLACE JWT_SECRET W JWT_ADMIN_SECRET FOR ADMIN ROUTE HANDLERS 

import Admin from "../models/database.js";
import Course from "../models/database.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();


const adminSignInController = async function (req,res){
    const {email,password} = req.body;
    try{
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            const validate = await bcrypt.compare(password,existingAdmin.password);
            if(!validate) return res.status(404).json({message:"Incorrect password"});
            if (validate){
                const accessToken = jwt.sign({id:existingAdmin._id},process.env.JWT_ADMIN_SECRET);
                if(!accessToken) return res.status(404).json({message:"Could not authenticate access token"});
            }
                return res.json({message:"Admin signed in",accessToken});
        }
        return res.status(404).json({message:"Could not find admin"});

    }catch(err){
        return res.status(500).json({message:"Internal server error:",err});
    }
    
};

const adminSignUpController = async function (req,res){
    const {email,password,firstName,lastName} = req.body;
    try{
        const newAdmin = await Admin.create({firstName,lastName, email,password});
        if(!newAdmin) return res.status(400).json({message:"Could not create new user"});
        const accessToken = jwt.sign({id:newAdmin._id},process.env.JWT_ADMIN_SECRET);
        if(!accessToken) return res.status(404).json({message:"Could not authenticate access token"});
        res.json({message:"Admin signed up",accessToken});
    } catch(err){
        return res.status(500).json({message:"Internal server error:",err});
    }
    
};

const adminCourseController = async function (req,res){
    const adminId = req.adminId;

    if(adminId){
        const {title,description,price,imageUrl} = req.body;
        try{
            const createCourse = await Course.create({title:title,
                description:description,price:price,
                // isntead of url - refer youtube build web3 saas app in 6 hours harkirat video 
                //if u want to put image instead of url
                imageUrl:imageUrl,creatorId:adminId});
            if(!createCourse) return res.status(404).json({message:"Could not create course"});        
            res.json({message:"Admin created course",courseId:createCourse._id});
        }catch(err){
            return res.status(500).json({message:"internal server error:",err});
        }
          }
}

const adminPutCourseController = async function(req,res){
    const adminId = req.adminId;
    if(adminId){
        const {title,description,price,imageUrl} = req.body;
        const {courseId} = req.params.id;
        try{
            const createCourse = await Course.findByIdAndUpdate({courseId,title:title,
                description:description,price:price,
                // isntead of url - refer youtube build web3 saas app in 6 hours harkirat video 
                //if u want to put image instead of url
                imageUrl:imageUrl,creatorId:adminId});
            if(!createCourse) return res.status(404).json({message:"Could not edit course"});
            res.json({message:"Admin edited course",courseId:createCourse._id});
        }catch(err){
            return res.status(500).json({message:"internal server error:",err});
        }
              
    }
    
}

const adminGetCourseController = async function (req,res){
    try{
        const courses = await Course.find();
    if(!courses) return res.status(404).json({message:"Could not find courses"});
    res.json({message:"Admin gets all courses in bulk"});
    }catch(err){
        return res.status(500).json({message:"internal server error:",err});
    }
    
}

export default {adminSignInController,adminSignUpController,adminCourseController,adminPutCourseController,adminGetCourseController};