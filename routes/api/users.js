const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator/check");
const conn = require("../../config/db");

// @route   POST api/users
// @desc    Register User
//@acess    Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    // See if userr exists
    let user=conn.query("SELECT * from user  where email=?", email, function(
      err,
      results,
      fields
    ) {
      if (err) {
        res.status(400).json({ errors: [{ msg: "Server Error" }] });
      }
      console.log(results);
      if (results.length >= 1) {
        res.status(400).json({ errors: [{ msg: "User Already Exists" }] });
        return;
      }
    });

    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });

    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    password_hash = await bcrypt.hash(password, salt);
    console.log("Came Here");
    await conn.query(
      "INSERT INTO user VALUES(?,?,'vutla',?,?,'0','2028676125','College Park,MD')",
      [email, name, password_hash, avatar],
      function(err, results, fields) {
        if (err) throw err;
        res.send("User registered");
      }
    );
    // Return jsonwebtoken
    //res.send("d");
  }
);

module.exports = router;
