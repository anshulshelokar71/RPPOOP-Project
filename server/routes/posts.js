import express from "express";
import { getFeedPosts,getQuiz,update,getQuizUser,getUserPosts} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// /* READ */
router.get("/", getFeedPosts);
router.get("/quiz/:id",verifyToken,getQuiz);
router.get("/getQuiz/:id",verifyToken,getQuizUser)
router.get("/getStudents/:id", verifyToken, getUserPosts);

// /* UPDATE */
router.patch("/update",verifyToken, update);

export default router;
