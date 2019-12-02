const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");
const conn = require("../../config/db");

// @route   POST api/users
// @desc    Register User
//@acess    Public
router.post(
  "/",
  [
    check("first_name", "Name is required")
      .not()
      .isEmpty(),
    check("last_name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
    check("user_type", "Please indicate user user type"),
    check("phone", "Enter your mobile number").isLength({ min: 10 }),
    check("address", "Enter your address").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      first_name,
      last_name,
      password,
      user_type,
      phone,
      address
    } = req.body;
    // See if user exists

    try {
      conn.query(
        "SELECT * from user  where email=?",
        email,
        async function(err, results, fields) {
          if (results.length >= 1) {
            return res.status(400).json({ msg: "User Exists" });
          } else {
            //GET avator
            const avatar = gravatar.url(email, {
              s: "200",
              r: "pg",
              d: "mm"
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);
            password_hash = await bcrypt.hash(password, salt);

            conn.query(
              "INSERT INTO user VALUES(?,?,?,?,?,?,?,?)",
              [
                email,
                first_name,
                last_name,
                password_hash,
                avatar,
                user_type,
                phone,
                address
              ],
              function(err, results, fields) {
                if (err) console.log(err);
              }
            );

            const payload = {
              user: {
                id: email,
                type: user_type
              }
            };

            jwt.sign(
              payload,
              config.get("jwtSecret"),
              { expiresIn: 3600000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token });
              }
            );
          }
        }
        // Get users gravatar
      );
    } catch (err) {
      console.log(err);
    }

    // Return jsonwebtoken
    //res.send("d");
  }
);

module.exports = router;
