const express = require('express');
const router = express.Router();
const rideController = require('../controller/ride.controller');
const authMiddleware = require('../middleware/auth.middleware');
router.post("/create-ride",authMiddleware.userAuth,rideController.createRide)

module.exports = router;