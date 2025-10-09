import dotenv from "dotenv"
import { app } from "./app.js"
import { dbConnect } from "./utiles/dbConnection.js"


// Load environment variables
dotenv.config({
    path: './.env'
})

dbConnect().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
    console.log("Database connected successfully");
}).catch((err) => {
    console.error("Database connection failed:", err);
});

export default app;