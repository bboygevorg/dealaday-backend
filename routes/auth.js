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

// add Address
router.post("/addAddress", authUser, async (req, res) => {
  const { address } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.address.includes(address)) {
      return res.status(400).json({
        success: false,
        message: "Address already exists for the user",
      });
    }

    user.address.push(address);

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Address added successfully" });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// delete Address
router.post("/deleteaddress", authUser, async (req, res) => {
  const { index } = req.body;
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unaouthorized" });
    }

    if (!user.address) {
      return res.status(400).json({ message: "User address data is invalid" });
    }

    const adjustedIndex = index - 1;
    success = true;

    if (adjustedIndex >= 0 && adjustedIndex < user.address.length) {
      const deletedAddress = user.address.splice(adjustedIndex, 1);
      await user.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Address removed successfully",
          deletedAddress,
        });
    } else {
      return res.status(400).json({ message: "Invalid address index" });
    }
  } catch (error) {
    console.error("Error removing address:", error);
    return res.status(500).json({ message: "Internal server error" });
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
