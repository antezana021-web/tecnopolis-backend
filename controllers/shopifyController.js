// C:\Users\PC MIGUEL\Desktop\tecnopolis\backend\controllers\shopifyController.js
const {
    testShopifyConnection,
    getProducts,
    createShopifyOrder,
    getExchangeRate
} = require("../services/shopifyService");


async function testConnection(req, res) {
    try {
        const data = await testShopifyConnection();

        res.json({
            ok: true,
            shop: data
        });

    } catch (error) {
        console.error("Error de conexión con Shopify:", error.message);

        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}


async function listProducts(req, res) {
    try {
        const products = await getProducts();

        res.json({
            ok: true,
            products
        });

    } catch (error) {
        console.error("Error al obtener productos:", error.message);

        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}


async function createOrder(req, res) {
    try {
        // Recibe los datos enviados por el checkout
        const orderData = req.body;

        // Crea la orden real en Shopify
        const order = await createShopifyOrder(orderData);

        res.status(201).json({
            ok: true,
            message: "Pedido creado correctamente en Shopify",
            order: {
                id: order.id,
                name: order.name,
                order_number: order.order_number,
                financial_status: order.financial_status,
                total_price: order.total_price
            }
        });

    } catch (error) {
    console.error("Error completo al crear el pedido:");
    console.error(error.stack || error);

    res.status(500).json({
        ok: false,
        error: error.message
    });
}
}


async function exchangeRate(req, res) {
    try {
        const rate = await getExchangeRate();

        res.json({
            ok: true,
            exchangeRate: rate
        });

    } catch (error) {
        console.error("Error al obtener la tasa:", error.message);

        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
}


async function getOrderDetails(req, res) {
    try {
        const { orderId } = req.params;
        
        // 1. Obtener la orden desde Shopify (usando la API Admin de Shopify)
        const response = await fetch(`https://${process.env.SHOPIFY_STORE}/admin/api/2026-07/orders/${orderId}.json`, {
            method: "GET",
            headers: {
                "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_TOKEN,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            return res.status(404).json({ success: false, error: "Pedido no encontrado en Shopify" });
        }

        const data = await response.json();
        
        // 2. Obtener la tasa de cambio actual directamente de la configuración del tema
        const exchangeRateValue = await getExchangeRate();

        res.json({
            success: true,
            order: {
                ...data.order,
                tasaUsdt: parseFloat(exchangeRateValue) || 11.90
            }
        });

    } catch (error) {
        console.error("Error al obtener detalles del pedido:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
}


module.exports = {
    testConnection,
    listProducts,
    createOrder,
    exchangeRate,
    getOrderDetails
};