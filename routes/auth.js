const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const bcrypt = require("bcrypt");
const authUser = require("../middleware/authUser");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

// create a user
let success = false;

router.post(
  "/register",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .send({ error: "Sorry, a user with this email already exists" });
      }

      //   password hashing
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      //   create a new user
      user = await User.create({
        email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      res.send({ success, authToken });
    } catch (error) {
      res.status(500).send("Internal server error");
    }
  }
);

// login Route
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ success, error: "User not found" });
      }
      const passComp = await bcrypt.compare(password, user.password);
      if (!passComp) {
        return res.status(400).send({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const data = {
        user: {
          id: user._id,
        },
      };

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      success = true;
      res.send({ success, authToken });
    } catch (error) {
      res.status(500).send("Internal server error002");
    }
  }
);

// update user details
router.put("/updateuser", authUser, async (req, res) => {
  const { userDetails } = req.body;
  let converData = JSON.parse(userDetails);
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      let updateDetails = await User.findByIdAndUpdate(req.user.id, {
        $set: converData,
      });
      success = true;
      res.status(200).send({ success });
    } else {
      return res.status(400).send("User Not Found");
    }
  } catch (error) {
    res.send("Something went wrong");
  }
});

// get user
router.get("/getuser", authUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    success = true;
    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

module.exports = router;