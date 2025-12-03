import { Router } from "express";
import dataController from "./data.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/all", authMiddleware, dataController.getAllData);

export default router;
