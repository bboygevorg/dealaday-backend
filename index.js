const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectToMongo = require("./config");
const path = require("path");

const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const auth = require("./routes/auth");
const forgotPassword = require("./routes/forgotPassword");
const wishlist = require("./routes/wishlist");
const review = require("./routes/review");

dotenv.config();

const PORT = 5000;
const app = express();

app.use(express.json());
app.use(cors());

connectToMongo();

app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/user/auth", auth);
app.use("/user/password", forgotPassword);
app.use("/user/wishlist", wishlist);
app.use("/user/review", review);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
