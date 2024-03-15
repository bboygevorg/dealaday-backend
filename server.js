const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const connectToMongo = require("./config");

dotenv.config();

const PORT = 5000;
const app = express();

app.use(express.json());
app.use(cors());

connectToMongo();

app.use(productRoutes);
app.use(cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
