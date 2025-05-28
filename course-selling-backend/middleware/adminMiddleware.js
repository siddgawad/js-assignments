
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET;


const adminMiddleware = async function(req,res,next){
    const accessToken = req.headers.token;
    const decoded = jwt.verify(accessToken,JWT_ADMIN_SECRET);
    if(decoded){
        req.adminId = decoded.id;
        next();
    }else{
        res.status(403).json({message:"You are not signed in"});
    }
};

export default adminMiddleware;
