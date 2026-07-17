const { v4: uuidv4 } = require("uuid");

async function createOrder(orderData) {

    const orderId = uuidv4();

    // Productos del carrito de Shopify
    const line_items = orderData.items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity
    }));

    // Crear Draft Order en Shopify
    const response = await fetch(
        `https://${process.env.SHOPIFY_STORE}/admin/api/${process.env.SHOPIFY_API_VERSION}/draft_orders.json`,
        {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                draft_order: {
                    line_items
                }
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        console.error(data);
        throw new Error("No se pudo crear el Draft Order");
    }

    return {
        orderId,
        draftOrderId: data.draft_order.id,
        invoiceUrl: data.draft_order.invoice_url
    };
}

async function getOrder(orderId) {
    return { orderId };
}

module.exports = {
    createOrder,
    getOrder
};