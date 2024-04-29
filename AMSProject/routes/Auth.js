const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); //helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
require("dotenv").config();
//Login
// router.post(
//   "/login",
//   body("email").isEmail().withMessage("Please enter a valid email"),
//   body("password")
//     .isLength({ min: 8, max: 12 })
//     .withMessage("Password should be between 8-12 characters"),
//   async (req, res) => {
//     try {
//       // Validation request (express validation) check on request
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       // Check if user exists
//       const query = util.promisify(conn.query).bind(conn);
//       const user = await query("SELECT * FROM users WHERE email = ?", [
//         req.body.email,
//       ]);
//       if (user.length == 0) {
//         return res.status(404).json({
//           errors: [
//             {
//               msg: "Email or password not found!",
//             },
//           ],
//         });
//       }

//       // Check if account status is accepted
//       if (user[0].account_status !== "accepted") {
//         console.log("Account status rejected");
//         return res.status(401).json({
//           errors: [
//             {
//               msg: "You Don't have  permission ",
//             },
//           ],
//         });
//       }

//       // Compare hashed password
//       const checkPassword = await bcrypt.compare(
//         req.body.password,
//         user[0].password
//       );
//       if (checkPassword) {
//         delete user[0].password;
//         return res.status(200).json(user);
//       } else {
//         return res.status(404).json({
//           errors: [
//             {
//               msg: "Email or password not found!",
//             },
//           ],
//         });
//       }
//     } catch (err) {
//       res.status(500).json({ err: err });
//     }
//   }
// );
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("Password should be between 8-12 characters"),
  async (req, res) => {
    try {
      // Validation request (express validation) check on request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if user exists
      const query = util.promisify(conn.query).bind(conn);
      const user = await query("SELECT * FROM users WHERE email = ?", [
        req.body.email,
      ]);
      if (user.length == 0) {
        return res.status(404).json({
          errors: [
            {
              msg: "Email or password not found!",
            },
          ],
        });
      }

      // Check if account status is accepted
      if (user[0].account_status !== "accepted") {
        console.log("Account status rejected");
        return res.status(401).json({
          errors: [
            {
              msg: "You Don't have permission ",
            },
          ],
        });
      }

      // Compare hashed password
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (checkPassword) {
        // Generate JWT token
        const token = jwt.sign(
          {
            userId: user[0].user_id,
            email: user[0].email,
            userType: user[0].type,
          },
          process.env.JWT_SECRET, // Replace this with your secret key
          { expiresIn: "1h" } // Token expiration time
        );

        // Remove sensitive data from user object
        delete user[0].password;
        res.setHeader(
          "Set-Cookie",
          cookie.serialize("jwt", token, {
            httpOnly: true,
            maxAge: 3600, // Cookie expiration time in seconds (1 hour)
            sameSite: "strict",
            path: "/", // Cookie path
          })
        );

        // Send token and user information in response
        return res.status(200).json({ token, user: user[0] });
      } else {
        return res.status(404).json({
          errors: [
            {
              msg: "Email or password not found!",
            },
          ],
        });
      }
    } catch (err) {
      res.status(500).json({ err: err });
    }
  }
);
// Registration

router.post(
  "/register",
  body("email").isEmail().withMessage("please Entr a Valid Email"),
  body("user_name")
    .isString()
    .withMessage("please Entr a Valid name")
    .isLength({ min: 10, max: 20 })
    .withMessage("name Should be between(10-20)Character"),
  body("password")
    .isLength({ min: 8, max: 12 })
    .withMessage("password Should be between(8-12)Character"),
  body("phone")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone Should be between(9-15)Character"),

  async (req, res) => {
    try {
      //Validation request (express validation)
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //2-CHECK IF EMAIL IS EXIXT
      //AWIT/ASYNC
      const query = util.promisify(conn.query).bind(conn); //transform mysql query--< promise to use(awit/async)
      const checkEmailExists = await query(
        "select * from users where email = ?",
        [req.body.email]
      );
      if (checkEmailExists.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: "email already exixts!",
            },
          ],
        });
      }

      //3-prapare object of user to save

      const userData = {
        user_name: req.body.user_name,
        email: req.body.email,
        type: req.body.type,
        password: await bcrypt.hash(req.body.password, 10),
        phone: req.body.phone,
      };

      //4- insert user object to DB
      await query("insert into users set ?", userData);
      delete userData.password;
      res.status(200).json(userData);

      //res.json("success");
    } catch (err) {
      res.status(500).json({ err: err });
    }
  }
);

module.exports = router;
