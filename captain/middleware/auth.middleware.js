const jwt = require("jsonwebtoken");
const captainModel = require("../models/captain.models");
const blacklisttokenModel = require('../models/blacklisttoken.models');

module.exports.captainAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }

    const isBlacklisted = await blacklisttokenModel.find({ token });

    if (isBlacklisted.length) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const captain = await captainModel.findById(decoded.id);
    if (!captain) {
      throw new Error("Unauthorized");
    }
    req.captain = captain;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    // console.log(error);
  }
};
