const rideModel = require("../models/ride.model");
const { publishToQueue } = require("../service/rabbit");
module.exports.createRide = async (req, res, next) => {
  try {
    const { pickup, destination } = req.body;
    const newRide = new rideModel({
      user: req.user._id,
      pickup,
      destination,
    });

    await newRide.save();
    publishToQueue("new-ride", JSON.stringify(newRide));
    res.json(newRide);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.acceptRide = async (req, res, next) => {
  try {
    const { rideId } = req.query;
    const ride = await rideModel.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    ride.status = "accepted";
    await ride.save();
    publishToQueue("ride-accepted", JSON.stringify(ride));
    res.json(ride);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
