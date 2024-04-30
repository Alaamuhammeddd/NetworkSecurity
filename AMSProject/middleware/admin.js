const jwt = require("jsonwebtoken");
const conn = require("../db/dbConnection");
const util = require("util");

const admin = async (req, res, next) => {
  try {
    // const query = util.promisify(conn.query).bind(conn);

    // // Extract the token from the request headers
    // const token =
    //   req.headers.authorization && req.headers.authorization.split(" ")[1];
    // console.log("admin :" + token);
    // if (!token) {
    //   return res.status(401).json({ message: "Authorization token missing" });
    // }

    // // Verify the token
    // jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    //   if (err) {
    //     return res.status(401).json({ message: "Invalid token" });
    //   }

    //   // Check if the user associated with the token is an admin
    //   const adminUser = await query("SELECT * FROM users WHERE user_id = ?", [
    //     decoded.user_id,
    //   ]);

    if (req.type !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this route" });
    }

    // If the user is an admin, proceed to the next middleware
    //
    next();
  } catch (error) {
    console.error("Error in admin middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = admin;
