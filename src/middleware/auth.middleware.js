import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
export const verifyJWT = async(req ,res ,next)=>{
     try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            return res.status(401).json({message:"Unorhorized : access token not avalilble"})
        }

               const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

                  const user =   await User.findById(decodedToken._id).select("-password");
                     if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
             req.user = user;
             next();

     } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
     }
}