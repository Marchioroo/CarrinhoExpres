const express = require("express");
const fs = require("fs");
const router = express.Router();

const productsFilePath = "./produtos.json";

function loadProducts() {
  try {
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return []; 
  }
}

function saveProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

let products = loadProducts();
let nextId = products.length + 1;


router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit) || products.length;
  res.json(products.slice(0, limit));
});


router.get("/:nid", (req, res) => {
  const nid = parseInt(req.params.nid);
  const product = products.find((p) => p.id === nid);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Produto não encontrado" });
  }
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails = [],
  } = req.body;

  if (!title || !description || !code || price === undefined || stock === undefined || !category) {
    return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  const newProduct = {
    id: nextId++,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  products.push(newProduct);
  saveProducts(products); 
  res.status(201).json(newProduct);
});

module.exports = router;
