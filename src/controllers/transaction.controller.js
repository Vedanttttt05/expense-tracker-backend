import {asyncHandler} from '../utils/asyncHandler.js';
import apiError from '../utils/apiError.js';
import { Transaction } from '../models/transaction.model.js';
import  apiResponse  from '../utils/apiResponse.js';
import mongoose from "mongoose";



const createTransaction = asyncHandler (async (req, res) => {
    const { amount, type, category, date, note } = req.body;
    if ([amount, type, category, date].some((field) => field === undefined || field === "")) {
        throw new apiError(400, "Amount, type, category, and date are required");
    }
    if (amount < 0) {
        throw new apiError(400, "Amount must be a positive number");
    }
    if (typeof amount !== "number") {
    throw new apiError(400, "Amount must be a number");
    }
    if (!["income", "expense"].includes(type)) {
        throw new apiError(400, "Type must be either 'income' or 'expense'");
    }
    const transaction = await Transaction.create({
        amount,
        type,
        category,
        date,
        note,
        user: req.user._id
    });

    res.status(201).json(new apiResponse(201, "Transaction created successfully", transaction));
});

const getTransactions = asyncHandler (async (req, res) => {
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
    const filters = { user: req.user._id, isDeleted: false };
    if (type) {
        if (!["income", "expense"].includes(type)) {
            throw new apiError(400, "Type filter must be either 'income' or 'expense'");
        }
        filters.type = type;
    }
    if (category) {
        filters.category = category;
    }
    if (startDate || endDate) {
        filters.date = {};
        if (startDate) {
            filters.date.$gte = new Date(startDate);
        }
        if (endDate) {
            filters.date.$lte = new Date(endDate);
        }
    }
    const transactions = await Transaction.find(filters)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    const total = await Transaction.countDocuments(filters);
    res.status(200).json(new apiResponse(200, "Transactions retrieved successfully", { transactions, total }));
});



