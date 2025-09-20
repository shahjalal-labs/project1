import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { User } from "@prisma/client";
import generateOTP from "../../../helpers/generateOtp";
import sendEmail from "../../../helpers/sendEmail";
import redisClient from "../../../helpers/redis";
import { uploadInSpace } from "../../../helpers/uploadInSpace";

//login user
const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
  fcmToken: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      fcmToken: payload.fcmToken,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

//google login
const googleLogin = async (payload: {
  email: string;
  fullName: string;
  fcmToken: string;
}) => {
  const user = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (user) {
    const accessToken = jwtHelpers.generateToken(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.jwt_secret as string,
      config.jwt.expires_in as string
    );
    return {
      accessToken,
    };
  }

  const newUser = await prisma.user.create({
    data: {
      email: payload.email,
      fullName: payload.fullName,
      password: "",
      fcmToken: payload.fcmToken,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
  };
};

// update or add user location in Redis using GEO
const userLocationUpdateInRedis = async (
  userId: string,
  userLocation: { longitude: number; latitude: number }
) => {
  const redisGeoKey = "userLocations"; // you can keep all users under one key

  // Use GEOADD to store location
  await redisClient.geoAdd(redisGeoKey, {
    longitude: userLocation.longitude,
    latitude: userLocation.latitude,
    member: userId,
  });

  return;
};

//send forgot password otp
const sendForgotPasswordOtpDB = async (email: string) => {
  const existringUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!existringUser) {
    throw new ApiError(404, "User not found");
  }
  // Generate OTP and expiry time
  const otp = generateOTP(); // 4-digit OTP
  const subject = "Your Password Reset OTP";
  const html = `
     <div style="font-family: Arial, sans-serif; color: #333;">
       <h2>Password Reset Request</h2>
       <p>Hi <b>${existringUser.fullName}</b>,</p>
       <p>Your OTP for password reset is:</p>
       <h1 style="color: #007BFF;">${otp}</h1>
       <p>This OTP is valid for <b>5 minutes</b>. If you did not request this, please ignore this email.</p>
       <p>Thanks, <br>The Support Team</p>
     </div>
   `;
  await sendEmail(email, subject, html);
  await redisClient.set(`otp:${email}`, otp, { EX: 300 });

  return otp;
};

// verify otp code
const verifyForgotPasswordOtpCodeDB = async (payload: {
  email: string;
  otp: string;
}) => {
  const { email, otp } = payload;

  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userId = user.id;

  const savedOtp = await redisClient.get(`otp:${email}`);
  if (!savedOtp) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  if (otp !== savedOtp) {
    throw new ApiError(401, "Invalid OTP.");
  }

  // 2️⃣ Delete OTP from Redis after successful verification
  await redisClient.del(`otp:${email}`);

  const forgetToken = jwtHelpers.generateToken(
    { id: userId, email },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return { forgetToken };
};

// reset password
const resetForgotPasswordDB = async (newPassword: string, userId: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) {
    throw new ApiError(404, "user not found");
  }
  const email = existingUser.email as string;
  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt)
  );

  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });
  return;
};

// get profile for logged in user
const myProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      profileImage: true,
      email: true,
    },
  });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  return user;
};

// update user profile only logged in user
const updateProfileIntoDB = async (
  userId: string,
  userData: User,
  file: Express.Multer.File
) => {
  console.log("file:", file, "data:", userData);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, "user not found for edit user");
  }
  let profileImage;
  if (file) {
    profileImage = await uploadInSpace(file, "users/profileImage");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      ...userData,
      profileImage: file ? profileImage : user.profileImage,
    },
  });

  return;
};

export const authService = {
  loginUserIntoDB,
  googleLogin,
  myProfile,
  updateProfileIntoDB,
  userLocationUpdateInRedis,
  sendForgotPasswordOtpDB,
  verifyForgotPasswordOtpCodeDB,
  resetForgotPasswordDB,
};
