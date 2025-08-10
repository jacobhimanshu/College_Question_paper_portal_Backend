import mongoose from "mongoose";

const questionPaperSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    paperfile: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const QuestionPaper = mongoose.model(
  "QuestionPaper",
  questionPaperSchema
);
