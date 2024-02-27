import Info from "../models/Post.js";
import Host from "../models/Host.js";

// /* CREATE */
export const infographics = async (req, res) => {
  try {
    const {name, about, date,contact } = req.body;
    console.log(req.body); 
    // const host = await Host.findById(userId);
    const newInfo = new Info({
      name:name,
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
    const isReg = post.registrations.find((element)=> element==studentsReg);
    const index = post.registrations.indexOf((element)=> element==studentsReg);

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
