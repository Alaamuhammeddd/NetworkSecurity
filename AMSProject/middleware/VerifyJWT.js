// const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const VerifyJWT = (req, res, next) => {
  const cookies = req.cookies;
  // console.log("cookies :" + cookies);

  if (!cookies?.jwt) return res.sendStatus(400);

  const token = cookies.jwt;

  console.log("verify :" + token);
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  } // Assuming token is sent in the Authorization header
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token" });
  });

  try {
    const decoded = jwt.verify(token, secretKey); // Replace 'your_secret_key' with your actual secret key
    req.user_email = decoded.email;
    req.userId = decoded.user_id;
    req.userType = decoded.type;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: "Forbidden" });
  }
};

// module.exports = VerifyJWT;
// const jwt = require("jsonwebtoken");
// const verifyJWT = (req, res, next) => {
//   const cookies = req.cookies;

//   console.log(cookies);
//   if (!cookies?.jwt) return res.sendStatus(400);
//   const token = cookies.jwt;
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.SendStatus(403);
//     req.email = decoded.user.email;
//     req.userId = decoded.user.userId;
//     next();
//   });
// };

module.exports = VerifyJWT;
