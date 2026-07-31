const express = require("express");
const router = express.Router();

const {
    testConnection,
    listProducts,
    createOrder
} = require("../controllers/shopifyController");

router.get("/test", testConnection);
router.get("/products", listProducts);
router.post("/create-order", createOrder);

module.exports = router;