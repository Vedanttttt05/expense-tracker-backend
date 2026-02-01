import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { app } from "./app.js";

import connectDB from "./db/index.js";

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
     
    app.on("error", (err) => {
        console.error("Server error", err);
    });
}).catch((err) => {
    console.error("Failed to connect to the database", err);
});
