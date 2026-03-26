import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";




const app = express(); 

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true
}));

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({ extended: true  , limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//routes 
import userRoutes from "./routes/user.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import budgetRoutes from "./routes/budget.routes.js";

app.use("/api/budgets", budgetRoutes);
app.use("/api/v1/" , userRoutes);
app.use("/api/v1/transactions" , transactionRoutes);
app.use("/api/v1/categories" , categoryRoutes);
export {app};