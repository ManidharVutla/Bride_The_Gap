const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const conn = require("../../config/db");

const { check, validationResult } = require("express-validator/check");
//@route GET api/profile/me
//@desc GET Current users profile
//@access Private

router.get("/me", auth, async (req, res) => {
  try {
    const email = req.user.id;
    const type = req.user.type;
    var table = student_profile;
    if (type == 1) table = employer_profile;
    conn.query("SELECT * from ? where email=?", [table, email], function(
      err,
      results,
      fields
    ) {
      conn.query(
        "SELECT first_name, last_name, avatar, phone, address from user where email=?",
        req.user.id,
        function(err, r, fields) {
          res.json(Object.assign({}, results[0], r[0]));
        }
      );
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Student Profile
  if (req.user.type == 0) {
    const { university, website, bio, skills, git } = req.body;
    //Check if profile exists
    try {
      conn.query(
        "SELECT * from student_profile where email=?",
        req.user.id,
        async function(err, results, fields) {
          if (err) throw err;
          if (results.length >= 1) {
            conn.query(
              "UPDATE student_profile SET university=?, website=?,bio=?,skills=?,git=? where email = ?",
              [university, website, bio, skills, git, req.user.id],
              function(err, results, fields) {
                if (err) throw err;
              }
            );
            //Else Create Profile
          } else {
            conn.query(
              "INSERT INTO student_profile VALUES(?,?,?,?,?,?)",
              [university, website, bio, skills, git, req.user.id],
              function(err, results, fields) {
                if (err) throw err;
              }
            );
          }
          return res.json({ university, website, bio, skills, git });
        }
      );
    } catch (err) {
      console.log(err);
    }
    //Employer Profile
  } else {
    const { company, website, bio, skills_looking } = req.body;
    //Check if profile exists
    try {
      conn.query(
        "SELECT * from employer_profile where email=?",
        req.user.id,
        async function(err, results, fields) {
          if (err) throw err;
          if (results.length >= 1) {
            conn.query(
              "UPDATE employer_profile SET company=?, website=?,bio=?,skills_looking=? where email = ?",
              [company, website, bio, skills_looking, req.user.id],
              function(err, results, fields) {
                if (err) throw err;
              }
            );
            //Else Create Profile
          } else {
            conn.query(
              "INSERT INTO employer_profile VALUES(?,?,?,?,?)",
              [company, website, bio, skills_looking, req.user.id],
              function(err, results, fields) {
                if (err) throw err;
              }
            );
          }
          return res.json({ company, website, bio, skills_looking });
        }
      );
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;
