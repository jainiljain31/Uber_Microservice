const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cookieParser = require("cookie-parser");
const captainRoutes = require("./routes/captain.routes");
const app = express();
const connectDB = require("./db/db");

// Connect to MongoDB

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", captainRoutes);

module.exports = app;
