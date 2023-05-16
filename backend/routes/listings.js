const express = require("express");
const router = express.Router();
const { Listing } = require("../models/listing");
const { User } = require("../models/user");

// Import the auth middleware
const auth = require("../middleware/auth");

// Get all listings
router.get("/", async (req, res) => {
  try {
    const search = req.query.search;
    const tag = req.query.tag;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { condition: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    const listings = await Listing.find(query);

    res.status(200).send(listings);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


// Get a listing by ID
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 15;

    const listings = await Listing.find({})
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).send(listings);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});


// Create a new listing
router.post("/", auth, async (req, res) => {
  try {
    const { name, price, description, condition, tags, image } = req.body;
    const userId = req.user._id;

    const listing = new Listing({
      name,
      price,
      description,
      condition,
      tags,
      image,
      userId,
    });

    await listing.save();

    const user = await User.findById(userId);
    user.listing.push(listing._id);
    await user.save();

    res.status(201).send(listing);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Update a listing by ID
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, price, description, condition, tags, image } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        description,
        condition,
        tags,
        image,
      },
      { new: true }
    );

    if (!listing) {
      res.status(404).send({ message: "Listing not found" });
      return;
    }

    res.status(200).send(listing);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Delete a listing by ID
router.delete("/:id", auth, async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) {
      res.status(404).send({ message: "Listing not found" });
      return;
    }

    const user = await User.findById(listing.userId);
    user.listing.pull(listing._id);
    await user.save();

    res.status(200).send({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

module.exports = router;
