const router = require("express").Router();
const mongoose = require("mongoose");
const { userSchema } = require("../models/user");
router.get('/:id', async (req, res) => {
    const user = mongoose.model("user", userSchema);
    const userId = req.params.id;
    user.findById(userId).then((result) => {
        res.send({firstName: result.firstName, lastName: result.lastName, email: result.email});
    }).catch((err) => {
        res.status(404).send("User not found");
    });
});
module.exports = router;