const mongoose = require("mongoose");
const { Schema } = mongoose;

const BannerProductSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    name: String,
    title: String,
    price: Number,
    price_previous: Number,
    bannerPicture: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BannerProduct", BannerProductSchema);
