import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Budget } from "../models/budget.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";


const createBudget = asyncHandler(async (req, res) => {
  const { amount, category, month, year } = req.body;

  if (!amount || !category || !month || !year) {
    throw new apiError(400, "All fields are required");
  }

  if (!mongoose.Types.ObjectId.isValid(category)) {
    throw new apiError(400, "Invalid category ID");
  }

  const categoryExists = await Category.findOne({
    _id: category,
    user: req.user._id
  });

  if (!categoryExists) {
    throw new apiError(404, "Category not found");
  }

  const budget = await Budget.create({
    amount,
    category,
    month,
    year,
    user: req.user._id
  });

  res.status(201).json(
    new apiResponse(201, "Budget created successfully", budget)
  );
});


const getBudgets = asyncHandler(async (req, res) => {
  const { month, year } = req.query;

  const filter = {
    user: req.user._id
  };

  if (month) filter.month = month;
  if (year) filter.year = year;

  const budgets = await Budget.find(filter).populate("category");

  res.status(200).json(
    new apiResponse(200, "Budgets fetched successfully", budgets)
  );
});


const updateBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid budget ID");
  }

  const budget = await Budget.findOne({
    _id: id,
    user: req.user._id
  });

  if (!budget) {
    throw new apiError(404, "Budget not found");
  }

  if (amount !== undefined) {
    budget.amount = amount;
  }

  await budget.save();

  res.status(200).json(
    new apiResponse(200, "Budget updated successfully", budget)
  );
});


const deleteBudget = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new apiError(400, "Invalid budget ID");
  }

  const budget = await Budget.findOne({
    _id: id,
    user: req.user._id
  });

  if (!budget) {
    throw new apiError(404, "Budget not found");
  }

  await budget.deleteOne();

  res.status(200).json(
    new apiResponse(200, "Budget deleted successfully")
  );
});


export {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
};