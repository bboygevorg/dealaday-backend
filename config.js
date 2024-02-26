const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const URL = process.env.MONGO_URL;

const connectToMongo = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;
