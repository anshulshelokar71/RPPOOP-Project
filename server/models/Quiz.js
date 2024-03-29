import mongoose from "mongoose";

const quizSchema = mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
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
  active: {
    type: Boolean,
    default: true // Quiz is not active by default
  },
  startTime: {
    type: Date,
    default: null // No start time initially
  },
  duration: {
    type: Number,
    default: 0 // No duration initially
  }
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
