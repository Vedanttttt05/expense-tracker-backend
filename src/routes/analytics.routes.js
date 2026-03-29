import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";

import {
    getMonthlySummary,
    getCategoryWiseExpense,
    getIncomeVsExpense,
    getTotalBalance
} from "../controllers/analytics.controller.js";

const router = Router();

router.get("/monthly", verifyJwt, getMonthlySummary);
router.get("/category", verifyJwt, getCategoryWiseExpense);
router.get("/income-expense", verifyJwt, getIncomeVsExpense);
router.get("/balance", verifyJwt, getTotalBalance);

export default router;