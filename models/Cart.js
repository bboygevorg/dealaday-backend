const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("cart", CartSchema);
