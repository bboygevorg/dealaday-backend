const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const DealsProduct = require("../models/DealsProduct");
const MostPopular = require("../models/MostPopular");
const TopProducts = require("../models/TopProducts");
const BannerProduct = require("../models/BannerProduct");
const Recommended = require("../models/Recommended");
const Banner = require("../models/Banner");

router.get("/products", async (req, res) => {
  try {
    const {
      category,
      brand,
      name,
      currentPage,
      rating,
      pageLimit,
      minPrice,
      maxPrice,
      color,
      sortName,
      sortPrice,
      sortRating,
    } = req.query;

    const filter = {};
    if (category) {
      filter.category = category;
    }

    if (brand) {
      filter.brand = brand;
    }

    if (rating) {
      filter.rating = rating;
    }

    if (color) {
      filter.color = color;
    }

    if (name) {
      filter.name = name;
    }

    if (minPrice && maxPrice) {
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    } else if (minPrice) {
      filter.price = { $gte: parseInt(minPrice) };
    } else if (maxPrice) {
      filter.price = { $lte: parseInt(maxPrice) };
    }

    const sortOptions = {};

    if (sortName === "asc") {
      sortOptions.name = 1;
    } else if (sortName === "desc") {
      sortOptions.name = -1;
    }

    if (sortPrice === "asc") {
      sortOptions.price = 1;
    } else if (sortPrice === "desc") {
      sortOptions.price = -1;
    }

    if (sortRating === "desc") {
      sortOptions.rating = -1;
    }

    const skip = (currentPage - 1) * pageLimit;
    const limit = parseInt(pageLimit);

    const totalCount = await Product.countDocuments(filter);
    res.setHeader("x-total-count", totalCount);

    res.setHeader("Access-Control-Expose-Headers", "x-total-count");

    const product = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// test Admin
router.put("/product/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const {
      name_1,
      description_1,
      name_2,
      description_2,
      name_3,
      description_3,
    } = req.body;

    const dynamicDescription = `<h3>${name_1}</h3><p>${description_1}<p><h3>${name_2}</h3><pre>${description_2}</pre><h3>${name_3}</h3><pre>${description_3}</pre>`;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.description = dynamicDescription;

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// test Admin
router.post("/dealsproducts", async (req, res) => {
  try {
    const { productId, name, img, price, price_previous, rating } = req.body;

    const newDealsProduct = new DealsProduct({
      productId,
      name,
      img,
      price,
      price_previous,
      rating,
    });

    await newDealsProduct.save();

    const dealsProductsCount = await DealsProduct.countDocuments();

    // If there are more than three products, remove one randomly
    if (dealsProductsCount > 3) {
      // Find a random product and delete it
      const randomProduct = await DealsProduct.aggregate([
        { $sample: { size: 1 } },
      ]);
      await DealsProduct.findByIdAndDelete(randomProduct[0]._id);
      console.log("Removed random product:", randomProduct[0]);
    }

    res.json({
      success: true,
      message: "Product added to DealsProduct collection.",
    });
  } catch (error) {
    // Handle errors
    console.error("Error adding product to DealsProduct collection:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.get("/dealsproducts", async (req, res) => {
  try {
    const product = await DealsProduct.find();
    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// test Admin
router.post("/mostpopular", async (req, res) => {
  try {
    const { productId, name, title, img, price, price_previous, rating } =
      req.body;

    const mostPopular = new MostPopular({
      productId,
      name,
      title,
      img,
      price,
      price_previous,
      rating,
    });

    await mostPopular.save();

    const mostPopularProductCount = await MostPopular.countDocuments();

    if (mostPopularProductCount > 7) {
      const randomProduct = await MostPopular.aggregate([
        { $sample: { size: 1 } },
      ]);
      await MostPopular.findByIdAndDelete(randomProduct[0]._id);
      console.log("Removed random product:", randomProduct[0]);
    }

    res.json({
      success: true,
      message: "Product added to MostPopular collection.",
    });
  } catch (error) {
    console.error("Error adding product to MostPopular collection:", error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
});

router.get("/mostpopular", async (req, res) => {
  try {
    const product = await MostPopular.find();
    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// test Admin
router.post("/topproducts", async (req, res) => {
  try {
    const { productId, name, title, img, price, price_previous, rating } =
      req.body;

    const topProducts = new TopProducts({
      productId,
      name,
      title,
      img,
      price,
      price_previous,
      rating,
    });

    await topProducts.save();

    const topProductsCount = await TopProducts.countDocuments();

    if (topProductsCount > 7) {
      const randomProduct = await TopProducts.aggregate([
        { $sample: { size: 1 } },
      ]);
      await MostPopular.findByIdAndDelete(randomProduct[0]._id);
      console.log("Removed random product:", randomProduct[0]);
    }

    res.json({
      success: true,
      message: "Product added to MostPopular collection.",
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.get("/topproducts", async (req, res) => {
  try {
    const product = await TopProducts.find();
    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// test Admin
router.post("/recommended", async (req, res) => {
  try {
    const { productId, name, title, img, price, price_previous, rating } =
      req.body;

    const recommended = new Recommended({
      productId,
      name,
      title,
      img,
      price,
      price_previous,
      rating,
    });

    await recommended.save();

    const recommendedCount = await Recommended.countDocuments();

    if (recommendedCount > 7) {
      const randomProduct = await Recommended.aggregate([
        { $sample: { size: 1 } },
      ]);
      await Recommended.findByIdAndDelete(randomProduct[0]._id);
      console.log("Removed random product:", randomProduct[0]);
    }

    res.json({
      success: true,
      message: "Product added to MostPopular collection.",
    });
  } catch (error) {
    res.status(500).send("Something went wromg");
  }
});

router.get("/recommended", async (req, res) => {
  try {
    const product = await Recommended.find();
    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// test Admin
router.post("/bannerproduct", async (req, res) => {
  try {
    const { productId, name, title, price, price_previous, bannerPicture } =
      req.body;

    const bannerProduct = new BannerProduct({
      productId,
      name,
      title,
      price,
      price_previous,
      bannerPicture,
    });

    await bannerProduct.save();

    const bannerProductCount = await BannerProduct.countDocuments();

    if (bannerProductCount > 1) {
      const randomProduct = await BannerProduct.aggregate([
        { $sample: { size: 1 } },
      ]);
      await BannerProduct.findByIdAndDelete(randomProduct[0]._id);
      console.log("Removed random product:", randomProduct[0]);
    }

    res.json({
      success: true,
      message: "Product added to MostPopular collection.",
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.get("/bannerproduct", async (req, res) => {
  try {
    const product = await BannerProduct.find();
    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

// test Admin
router.post("/banner", async (req, res) => {
  try {
    const { backGroundImage, name, description } = req.body;

    const banner = new Banner({
      backGroundImage,
      name,
      description,
    });

    await banner.save();

    const bannerProductCount = await Banner.countDocuments();

    if (bannerProductCount > 1) {
      const randomProduct = await Banner.aggregate([{ $sample: { size: 1 } }]);
      await Banner.findByIdAndDelete(randomProduct[0]._id);
      console.log("Removed random product:", randomProduct[0]);
    }

    res.json({
      success: true,
      message: "Product added to MostPopular collection.",
    });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

router.get("/banner", async (req, res) => {
  try {
    const product = await Banner.find();
    res.send(product);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;
