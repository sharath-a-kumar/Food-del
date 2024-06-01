import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js"; // Correct import path
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import 'dotenv/config.js'
import { loginUser } from "./controller/userController.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
// app config
const app = express();
const port = 4000;

// middleware 
app.use(express.json());
app.use(cors());

// db connection 
connectDB();


// api endpints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)


// define routes
app.get("/", (req, res) => {
    res.send("API WORKING");
});

// listen
app.listen(port, () => {
    console.log(`Server Started on http://localhost:${port}`);
});
