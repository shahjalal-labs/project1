//
import { Pet } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createPetIntoDB = async (payload: Pet) => {
  const user = await prisma.user.findFirst({
    where: {
      id: payload.userId,
    },
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const result = await prisma.pet.create({
    data: payload,
  });
  return result;
};

const getAllPetsFromDB = async () => {
  const result = await prisma.pet.findMany();
  if (!result) {
    throw new ApiError(404, "User not found");
  }

  return result;
};

export const PetService = {
  createPetIntoDB,
  getAllPetsFromDB,
};
