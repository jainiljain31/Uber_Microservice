const express = require("express");
const router = express.Router();
const captainController = require("../controllers/captain.controller");
const authmiddleware = require("../middleware/auth.middleware");
router.post("/register", captainController.register);

router.post("/login", captainController.login);
router.get("/logout", captainController.logout);
router.get("/profile", authmiddleware.captainAuth, captainController.profile);
router.patch("/toggle-availability",authmiddleware.captainAuth, captainController.toggleAvailability);

module.exports = router;
