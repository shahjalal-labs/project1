import express, { Application, NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import cors from "cors";
import router from "./app/routes";
import GlobalErrorHandler from "./app/middlewares/globalErrorHandler";
import { PrismaClient } from "@prisma/client";
import path from "path";
import redisClient from "./helpers/redis";

const app: Application = express();
const prisma = new PrismaClient();

// Middleware setup
(async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    await redisClient.connect();
  } catch (error) {
    console.error("Failed to connect to services:", error);
    process.exit(1); // exit app if connection fails
  }
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Route handler for root endpoint
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Welcome to api main route",
  });
});

// Router setup
app.use("/api/v1", router);

// Global Error Handler
app.use(GlobalErrorHandler);

// API Not found handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
