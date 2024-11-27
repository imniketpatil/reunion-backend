import { Router } from "express";
import {
  changeCurrentPassword,
  deleteAccount,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  testResult,
  updateAccountDetails,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

export default router;
