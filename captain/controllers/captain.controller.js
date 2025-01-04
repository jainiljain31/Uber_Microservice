const captainModel = require("../models/captain.models");
const blacklisttokenModel = require("../models/blacklisttoken.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const captain = await captainModel.findOne({ email });
    if (captain) {
      return res.status(400).json({ message: "captain already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newcaptain = new captainModel({
      name,
      email,
      password: hashedPassword,
    });
    await newcaptain.save();

    const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // delete captain._doc.password;
    res.cookie("token", token);

    res.json({ token, newcaptain });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
      return res.status(404).json({ message: "captain not found" });
    }

    const isMatch = await bcrypt.compare(password, captain.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    delete captain._doc.password;
    res.cookie("token", token);

    res.json({ token, captain });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blacklisttokenModel.create({ token });
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.profile = async (req, res) => {
  try {
    res.send(req.captain);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    captain.isavailable = !captain.isavailable;
    await captain.save();
    res.json(captain);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
