const jwt = require("jsonwebtoken");
const conn = require("../db/dbConnection");
const util = require("util");

const bidder = async (req, res, next) => {
  try {
    if (req.type !== "bidder") {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this route" });
    }

    next();
  } catch (error) {
    console.error("Error in bidder middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = bidder;
