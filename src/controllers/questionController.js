// import the model
import {QuestionPaper} from "../models/questionPaper.model.js";

// Controller to get all question papers
export const getAllQuestionPapers = async (req, res) => {
  try {
    const papers = await QuestionPaper.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json({
      success: true,
      message: "All question papers fetched successfully",
      papers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch question papers",
    });
  }
};
