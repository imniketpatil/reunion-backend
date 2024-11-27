import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const testResult = asyncHandler(async (req, res) => {
  res.send("Server is Running");
});

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  if ([email, password, name].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All Fields are Required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "This Email Already Exist");
  }

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went worng while creating the User");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Create Successfully"));
});

export { testResult, registerUser };
