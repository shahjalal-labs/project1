import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import prisma from "../../../shared/prisma";
import generateOTP from "../../../helpers/generateOtp";
import sendEmail from "../../../helpers/sendEmail";
import redisClient from "../../../helpers/redis";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
//p: AUTH SERVICE INTERPRET WITH CHATGPT: https://chatgpt.com/share/68ce4ed1-9374-800c-8299-01a5d9b0dec8
//
// create new user without otp verification
const createUserIntoDB = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(409, "email already exist!");
  }

  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const user = await prisma.user.create({
    data: {
      ...payload,

      password: hashedPassword,

      // stripeCustomerId: stripeAccount.id,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },

    config.jwt.jwt_secret as string,

    config.jwt.expires_in as string,
  );

  const { password, ...sanitizedUser } = user;

  return {
    accessToken,

    user: sanitizedUser,
  };
};
//
//create new user with otp verification
const createUser = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(409, "email already exist!");
  }

  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  // Prepare pending user object
  const pendingUserData = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    password: hashedPassword,
    nationality: payload.nationality,
    fcmToken: payload.fcmToken,
  };

  // Save pending user in Redis (store as JSON string)
  await redisClient.set(
    `pendingUser:${payload.email}`,
    JSON.stringify(pendingUserData),
    { EX: 300 }, // Optional: expire after 5 minutes if you want
  );

  // Generate OTP and expiry time
  const otp = generateOTP(); // 4-digit OTP
  const subject = "Your Password Reset OTP";
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2>Password Reset Request</h2>
      <p>Hi <b>${payload.firstName + " " + payload.lastName}</b>,</p>
      <p>Your OTP for password reset is:</p>
      <h1 style="color: #007BFF;">${otp}</h1>
      <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
      <p>Thanks, <br>The Support Team</p>
    </div>
  `;
  await sendEmail(payload.email, subject, html);
  await redisClient.set(`otp:${payload.email}`, otp, { EX: 300 });

  return otp;
};

// Verify user using OTP for signup
const signupVerification = async (payload: { email: string; otp: string }) => {
  const { email, otp } = payload;

  // 1️⃣ Fetch OTP from Redis
  const savedOtp = await redisClient.get(`otp:${email}`);
  if (!savedOtp) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  // 2️⃣ Compare OTP
  if (otp !== savedOtp) {
    throw new ApiError(401, "Invalid OTP.");
  }

  // 3️⃣ Fetch pending user data from Redis
  const pendingUserStr = await redisClient.get(`pendingUser:${email}`);
  if (!pendingUserStr) {
    throw new ApiError(404, "No pending user found. Please sign up again.");
  }
  const pendingUser = JSON.parse(pendingUserStr);

  // 4️⃣ Create new user inside DB transaction
  await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: pendingUser,
    });

    return createdUser;
  });

  // 5️⃣ Clean up Redis data after successful user creation
  await Promise.all([
    redisClient.del(`otp:${email}`),
    redisClient.del(`pendingUser:${email}`),
  ]);

  return;
};

//get single user
const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

//get all users
const getUsers = async () => {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    throw new ApiError(404, "Users not found!");
  }
  const sanitizedUsers = users.map((user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  });
  return sanitizedUsers;
};

//update user
const updateUser = async (id: string, userData: any) => {
  if (userData?.role || userData?.status) {
    throw new ApiError(403, "You can't update role and status");
  }
  if (!ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID format");
  }
  const existingUser = await getSingleUser(id);
  if (!existingUser) {
    throw new ApiError(404, "user not found for edit user");
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data: userData,
  });

  const { password, ...sanitizedUser } = updatedUser;

  return sanitizedUser;
};

//delete user
const deleteUser = async (userId: string, loggedId: string) => {
  if (!ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  if (userId === loggedId) {
    throw new ApiError(403, "You can't delete your own account!");
  }
  const existingUser = await getSingleUser(userId);
  if (!existingUser) {
    throw new ApiError(404, "user not found for delete this");
  }
  await prisma.user.delete({
    where: { id: userId },
  });
  return;
};

export const userService = {
  createUser,
  createUserIntoDB,
  signupVerification,
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
