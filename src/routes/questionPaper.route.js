import express from "express";


import { uploadQuestionPaper } from "../controllers/uploader.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import { getAllQuestionPapers } from "../controllers/questionController.js";
const router = Router();


router
  .route("/upload")
  .post(verifyJWT, upload.single("paperfile"), uploadQuestionPaper);
 
  router.route("/all").get(getAllQuestionPapers)


export default router;
