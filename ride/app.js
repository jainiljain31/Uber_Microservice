const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const connectDB = require("./db/db");
const rideRoutes = require("./routes/ride.routes");
const rabbitMq = require("./service/rabbit");

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
rabbitMq.connect();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", rideRoutes);
module.exports = app;
