import express from "express";
import {
  getHost,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getHost);

// router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
// router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
