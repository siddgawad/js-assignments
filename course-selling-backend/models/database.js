import mongoose from "mongoose";
import bcrypt from "bcrypt";



// user schema 

const userSchema = new mongoose.Schema({
    userId:{type:mongoose.Types.ObjectId},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true}
});

userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

const User = mongoose.model("User",userSchema);

//admin schema

const adminSchema = new mongoose.Schema({
    adminId:{type:mongoose.Types.ObjectId},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    firstName:{type:String,required:true},
    lastName:{type:String,required:true}
});

adminSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

const Admin = mongoose.model("Admin",adminSchema);

// course schema

const courseSchema = new mongoose.Schema({
    courseId:{type:mongoose.Types.ObjectId},
    title:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    imageUrl:{type:String,required:true},
    creatorId:{type:mongoose.Types.ObjectId}
});

const Course = mongoose.model("Course",courseSchema);

//purchase schema

const purchaseSchema = new mongoose.Schema({
    purchaseId:{type:mongoose.Types.ObjectId},
    courseId:{type:mongoose.Types.ObjectId},
    userId:{type:mongoose.Types.ObjectId}
});

const Purchase = mongoose.model("Purchase",purchaseSchema);

export default {User,Admin,Course,Purchase};

