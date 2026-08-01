// C:\Users\PC MIGUEL\Desktop\tecnopolis\backend\routes\shopifyRoutes.js
const express = require("express");
const router = express.Router();

const {
    testConnection,
    listProducts,
    createOrder,
    exchangeRate,
    getOrderDetails // <--- ¡Asegúrate de que esta línea esté aquí!
} = require("../controllers/shopifyController");

router.get("/test", testConnection);
router.get("/products", listProducts);
router.post("/create-order", createOrder);
router.get("/exchange-rate", exchangeRate);
router.get("/order/:orderId", getOrderDetails); // <--- Y esta ruta activa

module.exports = router;