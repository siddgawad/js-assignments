
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


const authMiddleware = async function(req,res){
    const accessToken = req.headers.token;
    const decoded = jwt.verify(accessToken,JWT_SECRET);
    if(decoded){
        req.userId = decoded.id;
    }else{
        res.status(403).json({message:"You are not signed in"});
    }
};

export default authMiddleware;
