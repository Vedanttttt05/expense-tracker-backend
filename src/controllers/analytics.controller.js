const getMonthlySummary = asyncHandler(async (req, res) => {

    const result = await Transaction.aggregate([
        {
            $match: {
                user: req.user._id,
                isDeleted: false
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                },
                totalIncome: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "income"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalExpense: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "expense"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } }
    ])

    res.status(200).json(
        new apiResponse(200, "Monthly summary", result)
    )
})