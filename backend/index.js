require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const finduserRoutes = require("./routes/finduser");
const getuserRoutes = require("./routes/getUser");
// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

//  routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/finduser", finduserRoutes);
app.use("/api/getuser", getuserRoutes);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
