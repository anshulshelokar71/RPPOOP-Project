import Info from "../models/Post.js";
import Host from "../models/Host.js";
import Quiz from "../models/Quiz.js";

// /* CREATE */
export const infographics = async (req, res) => {
  try {
    const id = req.params;
    const {about, date,contact } = req.body;
    console.log(req.body); 
    // const host = await Host.findById(userId);
    const newInfo = new Info({
      infoId:id,
      about:about,
      date:date,
      contact:contact,
    });
    await newInfo.save();

    const info = await Info.find();
    res.status(201).json(info);
  } catch (err) {
    console.log(err)
    res.status(409).json({ message: err.message });

  }
};

export const quiz = async (req, res) => {
  try {
    const id = req.params;
    const {questions} = req.body;
    console.log(questions); 
    // const host = await Host.findById(userId);
    const newQuiz = new Quiz({
      quizId:id,
      answers:questions.answers,
      options:questions.options,
      question_id:questions.question_id,
      question_identifier:questions.question_identifier,
      question_text:questions.question_text,
    });
    await newQuiz.save();

    const info = await Quiz.find();
    res.status(201).json(info);
  } catch (err) {
    console.log(err)
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
    const { _id,studentsReg } = req.body;
    const post = await Info.findById(_id);
    const isReg = post.registrations.find((element)=> element.userId===studentsReg.userId);
    const index = post.registrations.indexOf((element)=> element.userId===studentsReg.userId);

    if (isReg) {
      post.registrations.splice(index,1);
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
