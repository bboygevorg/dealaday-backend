const mongoose = require("mongoose");
const { Schema } = mongoose;

const DealsProductSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    name: String,
    img: String,
    price: Number,
    price_previous: Number,
    rating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DealsProduct", DealsProductSchema);
