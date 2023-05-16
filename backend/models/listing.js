const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
	
	name: { type: String, required: true },
	price: { type: Number, required: true },
	description: { type: String, required: true },
	condition: { type: String, required: true },
	tags: { type: [String], required: true},
	image: { type: String, required: false },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = {Listing};
