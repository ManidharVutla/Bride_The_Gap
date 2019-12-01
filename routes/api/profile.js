const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const conn = require("../../config/db");

const { check, validationResult } = require("express-validator/check");
//@route GET api/profile/me
//@desc GET Current users profile
//@access Private

router.get("/", auth, async (req, res) => {
  try {
    conn.query(
      "select first_name, last_name, avatar, address from the user where email=?",
      req.email
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/",
  [
    auth,
    [
      check("university", "University is Required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { university, website, bio, skills, git } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.email;

    if (university) profileFields.university = university;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (git) profileFields.git = git;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    console.log(skills);

    res.send("Hello");
  }
);

module.exports = router;
