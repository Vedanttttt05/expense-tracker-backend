import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getAIInsights } from "../controllers/ai.controller.js";

const router = Router();

router.get("/insights", verifyJwt, getAIInsights);

export default router;