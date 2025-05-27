
import User from "../models/database.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();


const userSignInController = async function (req,res){
    const {email,password} = req.body;
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            const validate = await bcrypt.compare(password,existingUser.password);
            if(!validate) return res.status(404).json({message:"Incorrect password"});
            if (validate){
                const accessToken = jwt.sign({id:existingUser._id},process.env.JWT_SECRET);
                if(!accessToken) return res.status(404).json({message:"Could not authenticate access token"});
            }
                return res.json({message:"User signed in",accessToken});
        }
        return res.status(404).json({message:"Could not find user"});

    }catch(err){
        return res.status(500).json({message:"Internal server error:",err});
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
        return res.status(500).json({message:"Internal server error:",err});
    }
    
};



export default {userSignInController,userSignUpController};
