const jwt = require("jsonwebtoken");
const userModel = require("../models/user.models");

module.exports.userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    if (!user) {
      throw new Error("Unauthorized");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
    // console.log(error);
  }
};
