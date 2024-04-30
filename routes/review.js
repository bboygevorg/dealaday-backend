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

router.put("/editreview", authUser, async (req, res) => {
  const { _id, comment, rating } = req.body;

  const review = await Review.findById(_id);

  try {
    if (review) {
      let updateDetails = await Review.findByIdAndUpdate(_id, {
        $set: { rating: rating, comment: comment },
      });
      success = true;
      res.status(200).send({ success, msg: "Review edited successfully" });
    } else {
      return res.status(400).send({ success, error: "User Not Found" });
    }
  } catch (error) {
    res.status("Something went wrong");
  }
});

router.delete("/deletereview/:id", authUser, async (req, res) => {
  const { id } = req.params;

  try {
    let deleteReview = await Review.deleteOne({
      $and: [{ user: req.user.id }, { _id: id }],
    });
    res.send({ msg: "Review deleted successfully" });
  } catch (error) {
    res.send({ msg: "Something went wrong,Please try again letter" });
  }
});

module.exports = router;
