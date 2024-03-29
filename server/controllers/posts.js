import Info from "../models/Post.js";
import Host from "../models/Host.js";
import Quiz from "../models/Quiz.js";

// /* CREATE */
export const infographics = async (req, res) => {
  try {
    const id = req.params.id;
    const { about, date, contact } = req.body;
    // const host = await Host.findById(userId);
    const newInfo = new Info({
      infoId: id,
      about: about,
      date: date,
      contact: contact,
    });
    await newInfo.save();

    const info = await Info.find();
    res.status(201).json(info);
  } catch (err) {
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

export const quiz = async (req, res) => {
  try {
    const id = req.params.id;
    const { questions } = req.body;
    console.log(questions);
    let quiz = await Quiz.findOne({ quizId: id });

    // If quiz doesn't exist, create a new one
    if (!quiz) {
      quiz = await Quiz.create({ quizId: id, questions: [] });
    }

    // const newQuiz = new Quiz({
    //   quizId:id,
    //   questions:questions
    // });
    quiz.questions.push(...questions);
    await quiz.save();

    // const info = await Quiz.find();
    res.status(201).json(quiz);
  } catch (err) {
    // console.log(req.body);
    console.log(err);
    res.status(409).json({ message: err.message });
  }
};

// /* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Info.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getQuiz = async (req, res) => {
  try {
    const id = req.params.id;
    const quiz = await Quiz.findOne({ quizId: id });
    const { questions } = quiz;
    res.status(200).json(questions);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getQuizUser = async (req, res) => {
  try {
    const id = req.params.id;
    const quizId = req.query.param1;
    const isReg = await Info.findOne({ infoId: quizId });
    if (isReg) {
      const student = await isReg.registrations.find(
        (user) => user.userId === id
      );
      if (student) {
        const quiz = await Quiz.findOne({ quizId: quizId });
        // console.log(quiz.questions[);
        console.log(quiz);
        res.status(200).json(quiz);
      }else{
        console.log("Student not found for userId:", id);
        return res.status(404).json({ message: "Student not found" });
      }
    } else {
      console.log("Info not found for quizId:", quizId);
      return res.status(404).json({ message: "Info not found" });
    }
    

    console.log(quizId);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const id = req.params.id;
    const question_ids = req.body;

    const quiz = await Quiz.findOne({ quizId: id });
    console.log(quiz);
    console.log(question_ids);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.questions = quiz.questions.filter(
      (question) => !question_ids.includes(String(question._id))
    );

    // Delete questions from the database
    await quiz.save();

    res.status(200).json({ message: "Questions deleted successfully" });
  } catch (error) {
    console.error("Error deleting questions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// export const getUserPosts = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const post = await Post.find({ userId });
//     res.status(200).json(post);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

// /* UPDATE */
export const update = async (req, res) => {
  try {
    const { _id, studentsReg } = req.body;
    const post = await Info.findById(_id);
    const isReg = post.registrations.find(
      (element) => element.userId === studentsReg.userId
    );
    const index = post.registrations.indexOf(
      (element) => element.userId === studentsReg.userId
    );

    if (isReg) {
      post.registrations.splice(index, 1);
    } else {
      post.registrations.push(studentsReg);
    }

    const updatedPost = await Info.findByIdAndUpdate(
      _id,
      { registrations: post.registrations },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
