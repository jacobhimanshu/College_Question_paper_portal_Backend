import { QuestionPaper } from "../models/questionPaper.model.js";
import UploadOnCloudinary from "../utility/cloudinary.js";

export const uploadQuestionPaper = async (req, res) => {
  try {
    const { subject, branch, semester, year } = req.body;
    console.log("subj", subject, year, branch);
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "PDF file is required" });
    }
    // console.log("reqfile", req.file);
    const localfilepath = req.file.path;
    // console.log("localfilepath------->>>", localfilepath);
    const cloudinaryResult = await UploadOnCloudinary(localfilepath);
    console.log("clores", cloudinaryResult);
    const newPaper = await QuestionPaper.create({
      subject,
      branch,
      semester,
      year,
      paperfile: cloudinaryResult?.secure_url,
      uploadedBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: "Question paper uploaded successfully",
      data: newPaper,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal Server Error whle uploading file",
      });
  }
};
