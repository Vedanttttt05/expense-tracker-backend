import { Router } from "express";

import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
} from "../controllers/budget.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJwt, createBudget);
router.get("/", verifyJwt, getBudgets);
router.put("/:id", verifyJwt, updateBudget);
router.delete("/:id", verifyJwt, deleteBudget);

export default router;