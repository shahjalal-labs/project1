import express from "express";
import { PetController } from "./pets.controller";
const router = express.Router();

router.post(
  "/create",
  (r, s, n) => {
    console.log(`hitting`);
    n();
  },
  PetController.createPet,
);

export const PetRoute = router;
