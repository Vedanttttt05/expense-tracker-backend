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

const getCategoryWiseExpense = asyncHandler(async (req, res) => {

    const result = await Transaction.aggregate([
        {
            $match: {
                user: req.user._id,
                type: "expense",
                isDeleted: false
            }
        },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" }
            }
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "category"
            }
        },
        {
            $unwind: "$category"
        }
    ])

    res.status(200).json(
        new apiResponse(200, "Category wise expense", result)
    )
})
