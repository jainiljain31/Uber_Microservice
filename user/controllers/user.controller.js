const userModel = require("../models/user.models");
const blacklisttokenModel = require("../models/blacklisttoken.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { subscribeToQueue } = require('../service/rabbit')
const EventEmitter = require('events');
const rideEventEmitter = new EventEmitter();
module.exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token);
    delete user._doc.password;

    res.json({ token, newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    delete user._doc.password;
    res.cookie("token", token);

    res.json({ token, user });
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
    res.send(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.acceptedRide = async (req, res) => {
  // Long polling: wait for 'ride-accepted' event
  rideEventEmitter.once('ride-accepted', (data) => {
      res.send(data);
  });

  // Set timeout for long polling (e.g., 30 seconds)
  setTimeout(() => {
      res.status(204).send();
  }, 30000);
}

subscribeToQueue('ride-accepted', async (msg) => {
  const data = JSON.parse(msg);
  rideEventEmitter.emit('ride-accepted', data);
});