import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";


const createCategory = asyncHandler(async (req, res) => {
    const { name, type } = req.body;

    if (!name || !type) {
        throw new apiError(400, "Name and type are required");
    }

    if (!["income", "expense"].includes(type.toLowerCase())) {
        throw new apiError(400, "Invalid category type");
    }

    const category = await Category.create({
        name,
        type,
        user: req.user._id
    });

    res.status(201).json(
        new apiResponse(201, "Category created successfully", category)
    );
});


const getCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find({
        user: req.user._id,
        isDeleted: false
    });

    res.status(200).json(
        new apiResponse(200, "Categories fetched successfully", categories)
    );
});


const updateCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name, type } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
        _id: id,
        user: req.user._id,
        isDeleted: false
    });

    if (!category) {
        throw new apiError(404, "Category not found");
    }

    if (name) category.name = name;
    if (type) category.type = type;

    await category.save();

    res.status(200).json(
        new apiResponse(200, "Category updated successfully", category)
    );
});


const deleteCategory = asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new apiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
        _id: id,
        user: req.user._id,
        isDeleted: false
    });

    if (!category) {
        throw new apiError(404, "Category not found");
    }

    category.isDeleted = true;
    await category.save();

    res.status(200).json(
        new apiResponse(200, "Category deleted successfully")
    );
});


export {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
};