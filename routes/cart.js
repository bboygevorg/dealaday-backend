const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.post("/addcart", async (req, res) => {
  try {
    const { _id, quantity } = req.body;

    const findProduct = await Cart.findOne({
      $and: [{ productId: _id }, { sessionToken }],
    });

    if (findProduct) {
      return res.status(400).json({ msg: "Product already in a cart" });
    } else {
      const cart = new Cart({
        productId: _id,
        quantity,
      });
      const savedCart = await cart.save();
      res.send(savedCart);
    }
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
