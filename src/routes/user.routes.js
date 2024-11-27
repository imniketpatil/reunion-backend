import { Router } from "express";
import { registerUser, testResult } from "../controllers/user.controller.js";

const router = Router();

router.route("/isActive").get(testResult);
router.route("/register").get(registerUser);

export default router;
