import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const testResult = asyncHandler(async (req, res) => {
  res.send("Server is Running");
});

const registerUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Hey Niket" });
});

export { testResult, registerUser };
