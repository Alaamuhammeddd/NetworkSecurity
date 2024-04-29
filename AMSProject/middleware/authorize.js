const jwt = require("jsonwebtoken");
const authorized = async (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    console.log("authorize :" + token);
    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      // Extract user information from the decoded token
      const userId = decoded.user_id;

      // You might want to validate the user in the database based on the userId
      // For simplicity, assuming the userId is sufficient for authorization
      const user = { id: userId }; // You can fetch user details from the database if needed

      // Attach user information to the request object
      req.user = user;

      // Proceed to the next middleware
      next();
    });
  } catch (error) {
    console.error("Error in authorized middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = authorized;
