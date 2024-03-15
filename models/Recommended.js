const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecommendedSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    name: String,
    img: String,
    title: String,
    rating: Number,
    price: Number,
    price_previous: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recommended", RecommendedSchema);
