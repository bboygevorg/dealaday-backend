const mongoose = require("mongoose");
const { Schema } = mongoose;

const RecommendedSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recommended", RecommendedSchema);
