import express from "express";
import { getFeedPosts,getQuiz,update,getQuizUser} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// /* READ */
router.get("/", getFeedPosts);
router.get("/quiz/:id",verifyToken,getQuiz);
router.get("/getQuiz/:id",verifyToken,getQuizUser)
// router.get("/:userId/posts", verifyToken, getUserPosts);

// /* UPDATE */
router.patch("/update",verifyToken, update);

export default router;
