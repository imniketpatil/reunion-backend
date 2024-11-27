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

router.route("/isActive").get(testResult);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//secured Routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/changePassword").patch(verifyJWT, changeCurrentPassword);
router.route("/deleteAccount").delete(verifyJWT, deleteAccount);
router.route("/updateCurrentUser").patch(verifyJWT, updateAccountDetails);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);

export default router;
