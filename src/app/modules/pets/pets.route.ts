import express from "express";
import { PetController } from "./pets.controller";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
const router = express.Router();

router.post(
  "/create",
  fileUploader.upload.single("petImage"),
  parseBodyData,
  PetController.createPet,
);

router.get("/", PetController.createPet);

export const PetRoute = router;
