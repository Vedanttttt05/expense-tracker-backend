import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../src/models/category.model.js";

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    await Category.insertMany([
      { name: "Food", type: "expense", isDefault: true },
      { name: "Rent", type: "expense", isDefault: true },
      { name: "Travel", type: "expense", isDefault: true },
      { name: "Shopping", type: "expense", isDefault: true },
      { name: "Salary", type: "income", isDefault: true },
      { name: "Freelance", type: "income", isDefault: true }
    ]);

    console.log("Default categories seeded");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedCategories();