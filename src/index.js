import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import connectdb from './db/db.js'
// import UploadOnCloudinary from"./utility/cloudinary.js"
const app = express();
app.use(cors());
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.send("res is sending");
})
app.listen(process.env.PORT || 8000,()=>{
    console.log("runnnign");
    
})
connectdb();



import userRouter from "./routes/user.routes.js"
app.use("/api/v1/user",userRouter)


import questionrouter from "./routes/questionPaper.route.js"
app.use("/api/paper",questionrouter)
