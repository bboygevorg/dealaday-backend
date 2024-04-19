const express = require("express");
const router = express.Router();
const authUser = require("../middleware/authUser");
const Wishlist = require("../models/Wishlist");

router.get("/fetchwishlist", authUser, async (req, res) => {
  try {
    const wishlistData = await Wishlist.find({ user: req.user.id }).populate(
      "productId"
    );
    res.send(wishlistData);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.post("/addwishlist", authUser, async (req, res) => {
  try {
    const { _id } = req.body;
    const findProduct = await Wishlist.findOne({
      $and: [{ productId: _id }, { user: req.user.id }],
    });
    if (findProduct) {
      return res.status(400).json({ msg: "Product already in a wishlist" });
    } else {
      const wishlistData = new Wishlist({ user: req.user.id, productId: _id });
      const savedWishlist = await wishlistData.save();
      res.send(savedWishlist);
    }
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.delete("/deletewishlist/:id", authUser, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Wishlist.findOneAndDelete({ productId: id });
    if (!result) {
      return res.status(404).send("Wishlist item not found");
    }
    res.send(result);
  } catch (error) {
    console.error("Error deleting wishlist item:", error);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
