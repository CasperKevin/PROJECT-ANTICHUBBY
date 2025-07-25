const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const PRODUCT_PATH = path.join(__dirname, "../product.json");

// GET /products — trả về mảng sản phẩm
router.get("/", (req, res) => {
  fs.readFile(PRODUCT_PATH, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading products" });
    try {
      const products = JSON.parse(data);
      res.json(products);
    } catch {
      res.status(500).json({ message: "Invalid product data" });
    }
  });
});

// POST /products — thêm mới sản phẩm
router.post("/", (req, res) => {
  const newProduct = req.body;
  fs.readFile(PRODUCT_PATH, "utf-8", (err, data) => {
    if (err) return res.status(500).json({ message: "Error reading products" });
    let products = [];
    try {
      products = JSON.parse(data);
    } catch {
      return res.status(500).json({ message: "Invalid product data" });
    }
    newProduct.product_id = products.length
      ? products[products.length - 1].product_id + 1
      : 1;
    products.push(newProduct);
    fs.writeFile(PRODUCT_PATH, JSON.stringify(products, null, 2), (err) => {
      if (err)
        return res.status(500).json({ message: "Error writing products" });
      res.json({ message: "Product added successfully" });
    });
  });
});

module.exports = router;
