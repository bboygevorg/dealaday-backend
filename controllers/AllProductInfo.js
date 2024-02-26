const Product = require("../models/Product");

const charData = async (req, res) => {
  try {
    const product = await Product.find();
    res.send({ product });
  } catch (error) {
    res.send(error);
  }
};

module.exports = { charData };
