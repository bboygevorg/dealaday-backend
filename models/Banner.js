const mongoose = require("mongoose");
const { Schema } = mongoose;

const BannerSchema = new Schema({
  backGroundImage: String,
  name: String,
  description: String,
});

module.exports = mongoose.model("Banner", BannerSchema);
