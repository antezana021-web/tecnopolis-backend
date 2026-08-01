const express = require("express");
const router = express.Router();

const {
    testConnection,
    listProducts,
    createOrder,
    exchangeRate,
    getOrderDetails
} = require("../controllers/shopifyController");

router.get("/test", testConnection);
router.get("/products", listProducts);
router.post("/create-order", createOrder);

// Ruta limpia para la tasa de cambio
router.get("/rate", exchangeRate);

// Ruta para los detalles de la orden
router.get("/order/:orderId", getOrderDetails);

module.exports = router;