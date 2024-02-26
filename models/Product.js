const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: String,
  title: String,
  img: String,
  category: String,
  brand: String,
  color: String,
  description: String,
  price: Number,
  price_previous: Number,
  rating: Number,
  sku: Number,
  icon_option: [
    {
      id: Number,
      icon: String,
      info: String,
      title: String,
    },
  ],
});

module.exports = mongoose.model("product", ProductSchema);
