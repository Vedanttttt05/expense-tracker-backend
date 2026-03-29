import { asyncHandler } from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";

import { Transaction } from "../models/transaction.model.js";

import { generateAIResponse } from "../services/gemini.service.js";


const getAIInsights = asyncHandler(async (req, res) => {

    const transactions = await Transaction.find({
        user: req.user._id,
        isDeleted: false
    })
    .populate("category")
    .sort({ date: -1 })
    .limit(50);


    if (!transactions.length) {
        throw new apiError(404, "No transactions found");
    }


const prompt = `
You are a personal finance advisor analyzing a user's transaction data.

## Transaction Data
${JSON.stringify(transactions)}

## Task
Analyze the data and return a JSON response with this exact structure:

{
  "summary": {
    "totalIncome": number,
    "totalExpenses": number,
    "netSavings": number,
    "savingsRate": "XX%"
  },
  "topCategories": {
    "income": [{ "category": string, "amount": number }],
    "expenses": [{ "category": string, "amount": number, "percentOfExpenses": "XX%" }]
  },
  "insights": [
    { "type": "warning" | "tip" | "positive", "message": string }
  ],
  "advice": [
    { "priority": "high" | "medium" | "low", "action": string, "reason": string }
  ]
}

## Rules
- Return ONLY valid JSON, no markdown, no explanation
- Max 3 items in topCategories each
- Max 4 insights, max 3 advice items
- Keep messages under 20 words each
- Flag any category exceeding 30% of total expenses as a warning
- Currency is INR
- CRITICAL: Return raw JSON only. No markdown, no code fences, no backticks, no comments.
- Your entire response must start with { and end with }
`;
    const raw = await generateAIResponse(prompt);


    let insights;
    try {
  insights = JSON.parse(raw);
    } catch (e) {
  throw new Error("Failed to parse AI response as JSON");
    }

return res.status(200).json({
  statusCode: 200,
  message: "AI Insights generated",
  data: insights,   // parsed object, not a string
  success: true
});
});


export { getAIInsights };