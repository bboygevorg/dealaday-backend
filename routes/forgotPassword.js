const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
const {
  sendEmailLink,
  setNewPassword,
} = require("../controllers/forgotPasswordController");
dotenv.config();

router.post("/forgot-password", sendEmailLink);
router.post("/forgot-password/:id/:token", setNewPassword);
module.exports = router;
