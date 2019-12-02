const express = require("express");
const router = express.Router();
const conn = require("../../config/db");
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/check");

//@route GET api/auth
//@desc Test route
//@access Public

router.get("/", auth, (req, res) => {
  try {
    conn.query(
      "SELECT email, first_name, last_name,avatar,phone,address from user where email=?",
      req.user.id,
      function(err, results, fields) {
        if (err) console.log(err);
        res.json(results);
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Enter Your password").isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      conn.query(
        "SELECT password from user where email=?",
        email,
        async function(err, results, fields) {
          if (results.length == 0) {
            return res.status(400).json({ msg: "Invalid Credentials" });
          } else {
            const isMatch = await bcrypt.compare(password, results[0].password);

            if (!isMatch) {
              return res.status(400).json({ msg: "Invalid Credentials" });
            }

            const payload = {
              user: {
                id: email
              }
            };

            jwt.sign(
              payload,
              config.get("jwtSecret"),
              { expiresIn: 3600000 },
              (err, token) => {
                if (err) throw err;
                res.json({ token, email });
              }
            );
          }
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
);
module.exports = router;
