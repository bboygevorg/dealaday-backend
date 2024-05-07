const express = require("express");
const router = express.Router();
const authUser = require("../middleware/authUser");

const dotenv = require("dotenv");
const {
  sendEmailLink,
  setNewPassword,
  resetPassword,
} = require("../controllers/forgotPasswordController");
dotenv.config();

router.post("/forgot-password", sendEmailLink);
router.post("/forgot-password/:id/:token", setNewPassword);
router.post("/forgot-password/reset", authUser, resetPassword);
module.exports = router;
