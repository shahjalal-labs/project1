//
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";

// create user without otp email verification
const CreateUser = catchAsync(async (req, res) => {
  const result = await userService.createUserIntoDB(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});
//
// register user with otp email verification
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Check your email for signup verification",
    data: result,
  });
});

// signup verification
const signupVerification = catchAsync(async (req, res) => {
  const result = await userService.signupVerification(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP verification successful",
    data: result,
  });
});

//get users
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getUsers();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users retrived successfully",
    data: users,
  });
});

//get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getSingleUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user retrived successfully",
    data: user,
  });
});

//update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const updatedUser = await userService.updateUser(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user updated successfully",
    data: updatedUser,
  });
});

//delete user
const deleteUser = catchAsync(async (req: any, res: Response) => {
  const userId = req.params.id;
  const loggedId = req.user.id;
  await userService.deleteUser(userId, loggedId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user deleted successfully",
  });
});

export const UserControllers = {
  CreateUser,
  createUser,
  signupVerification,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
