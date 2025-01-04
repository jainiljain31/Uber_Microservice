const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const connectDB = require("./db/db");

// Connect to MongoDB

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;
