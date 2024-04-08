const mongoose = require("mongoose");
const { Schema } = mongoose;

const DealsProductSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DealsProduct", DealsProductSchema);
