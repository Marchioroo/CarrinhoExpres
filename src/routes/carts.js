const express = require("express");
const fs = require("fs");
const router = express.Router();

const cartsFilePath = "./carrito.json";

function loadCarts() {
  try {
    const data = fs.readFileSync(cartsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return []; 
  }
}

function saveCarts(carts) {
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
}

let carts = loadCarts();
let nextCartId = carts.length + 1;

router.post("/", (req, res) => {
  const { products = [] } = req.body;

  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "'products' deve ser um array." });
  }

  const newCart = {
    id: nextCartId++,
    products,
  };

  carts.push(newCart);
  saveCarts(carts); 
  res.status(201).json(newCart);
});

router.get("/:cid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const cart = carts.find((c) => c.id === cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: "Carrinho não encontrado" });
  }
});

router.post("/:cid/product/:pid", (req, res) => {
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  const cart = carts.find((c) => c.id === cid);

  if (!cart) {
    return res.status(404).json({ error: "Carrinho não encontrado" });
  }

  const productInCart = cart.products.find((p) => p.product === pid);

  if (productInCart) {
    productInCart.quantity += 1;
  } else {
    cart.products.push({ product: pid, quantity: 1 });
  }

  saveCarts(carts); 
  res.status(200).json({
    message: "Produto adicionado ao carrinho com sucesso",
    cart: cart.products,
  });
});

module.exports = router;
