const jwt = require("jsonwebtoken");
const { User } = require("../models/user");

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
    console.log(decoded)
    const user = await User.findById(decoded._id);
    console.log(user)
    req.user = user;
    next();
  } catch (ex) {
    res.status(400).send({ error: "Invalid token." });
  }
}

module.exports = auth;
