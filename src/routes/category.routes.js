import { Router } from "express";

import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller.js";

import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJwt, createCategory);
router.get("/", verifyJwt, getCategories);
router.put("/:id", verifyJwt, updateCategory);
router.delete("/:id", verifyJwt, deleteCategory);

export default router;