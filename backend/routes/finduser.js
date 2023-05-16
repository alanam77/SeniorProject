const router = require("express").Router();
const mongoose = require("mongoose");
const { userSchema } = require("../models/user");
const {Listing} = require("../models/listing");
const auth = require("../middleware/auth");

//Logged in User Info
router.get("/",auth, async (req, res) => {
    const user = mongoose.model("user", userSchema);
    const userId = req.user._id;
    user.findById(userId).then((result) => {
        res.send(result);
    }).catch((err) => {
        res.status(404).send("User not found");
    });
});

//Get Logged In User's Listings
router.get("/listings", auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const listings = await Listing.find({userId: userId});
        res.status(200).send(listings);
    } catch (error) {
        res.status(404).send("Listings not found");
    }
});
module.exports = router;