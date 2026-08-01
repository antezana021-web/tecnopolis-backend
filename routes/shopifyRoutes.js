const express = require("express");
const router = express.Router();

const {
    testConnection,
    listProducts,
    createOrder,
    exchangeRate
} = require("../controllers/shopifyController");

router.get("/test", testConnection);
router.get("/products", listProducts);
router.post("/create-order", createOrder);
router.get("/exchange-rate", exchangeRate);
router.get("/order/:orderId", getOrderDetails);

module.exports = router;