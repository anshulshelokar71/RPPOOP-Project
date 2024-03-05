import mongoose from "mongoose";

const quizSchema = mongoose.Schema(
  {
    quizId: {
      type: Object,
    },
    questions: [{
      answers: {
        type: String,
        default: "",
        //   required: true,
      },

      options: {
        type: String,
        default: "",
        //   required: true,
      },
      question_id: {
        type: String,
        default: "",
        //   required: true,
      },
      question_identifier: {
        type: String,
        default: "",
        //   required: true,
      },
      question_text: {
        type: String,
        default: "",
        //   required: true,
      },
  }],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
