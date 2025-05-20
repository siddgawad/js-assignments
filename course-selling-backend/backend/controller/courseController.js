import { Course } from "../models/database"
import { Purchase } from "../models/database";

const getAllCoursesController = async function (req,res){
    try{
        const courses = await Course.find();
        if(!courses) return res.status(400).json({message:"Could not find courses"});
        return res.status(200).json({data:courses});

    }catch(err){
        return res.status(500).json({message:"Internal Server error:",err});
    }
   
}

const getAllPurchasedCoursesController = async function(req,res){
    const {userId} = req.params.id;
    try{
        const purchasedCourse = await Purchase.findById({userId});
        if(!purchasedCourse) return res.status(404).json({message:"No purchased courses"})
        // returning userid, course id, price at purchase and purchasedat - should later think about displaying purchasedcourses title, description, imageUrl, and on click 
    // should serve coursecontent
    const courseId = purchasedCourse.course;
    const coursePrice = purchasedCourse.priceAtPurchase;
    const coursePurchasedPrice = purchasedCourse.purchasedAt;

        return res.status(200).json({purchasedCourse, courseId, coursePrice, coursePurchasedPrice});

    } catch(err){
        return res.status(500).json({message:"Internal server error"});

    }
}

const purchaseCourseController = async function(req,res){
    // 
    
}


module.exports = {getAllCoursesController : getAllCoursesController ,getAllPurchasedCoursesController : getAllPurchasedCoursesController,purchaseCourseController: purchaseCourseController};