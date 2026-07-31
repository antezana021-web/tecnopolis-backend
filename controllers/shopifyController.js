const {
    testShopifyConnection,
    getProducts,
    createShopifyOrder
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


module.exports = {
    testConnection,
    listProducts,
    createOrder
};