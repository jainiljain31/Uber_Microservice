const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes");
const app = express();
const connectDB = require("./db/db");
const rabbitMq = require("./service/rabbit");

// Connect to MongoDB
connectDB();

// RabbitMQ connection
rabbitMq.connect();

// API endpoints
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", userRoutes);

module.exports = app;
