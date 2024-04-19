const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authUser = require("../middleware/authUser");

router.get("/getreview/:id", async (req, res) => {
  try {
    const reviewData = await Review.find({ productId: req.params.id }).populate(
      [{ path: "user", select: "firstName lastName" }]
    );
    res.send(reviewData);
  } catch (error) {
    console.error("Error in /getreview/:id route:", error);
    res.status(500).send(error.message);
    // res.status(500).send("Something went wrong");
  }
});

router.post("/addreview", authUser, async (req, res) => {
  try {
    const { id, comment, rating } = req.body;
    const user = req.header;
    const findReview = await Review.findOne({
      $and: [{ user: req.user.id }, { productId: id }],
    });
    if (findReview) {
      return res.status(400).json({ msg: "Already reviewed that product" });
    } else {
      const reviewData = new Review({
        user: req.user.id,
        productId: id,
        comment: comment,
        rating: rating,
      });
      const savedReview = await reviewData.save();
      res.send({ msg: "Review added successfully" });
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
