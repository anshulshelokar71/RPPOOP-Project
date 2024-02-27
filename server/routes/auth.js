import express from "express";
import { login,loginHost } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/loginHost", loginHost);


export default router;
