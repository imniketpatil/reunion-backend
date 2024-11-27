import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteMultipleTasks,
  deleteTask,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const router = Router();

router.route("/create-task").post(verifyJWT, createTask);
router.route("/get-tasks").get(verifyJWT, getTasks);
router.route("/update-task/:taskId").patch(verifyJWT, updateTask);
router.route("/delete-task/:taskId").delete(verifyJWT, deleteTask);
router.route("/delete-tasks").delete(verifyJWT, deleteMultipleTasks);

export default router;
