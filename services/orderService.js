const SHOP = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION;

/**
 * Crear una orden en Shopify
 */
async function createOrder(orderData) {

    const line_items = [];

    if (orderData.items) {

        for (const item of orderData.items) {

            line_items.push({
                variant_id: item.variant_id,
                quantity: item.quantity
            });

        }

    }

    const response = await fetch(
        `https://${SHOP}/admin/api/${VERSION}/orders.json`,
        {
            method: "POST",
            headers: {
                "X-Shopify-Access-Token": TOKEN,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                order: {
                    line_items,
                    financial_status: "pending"
                }
            })
        }
    );

    const data = await response.json();

    console.log("========== SHOPIFY ==========");
    console.log("Status:", response.status);
    console.log(JSON.stringify(data, null, 2));
    console.log("=============================");

    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }

    if (!data.order) {
        throw new Error("Shopify no devolvió una orden.");
    }

    return data.order.id;
}

/**
 * Obtener una orden
 */
async function getOrder(orderId) {

    const response = await fetch(
        `https://${SHOP}/admin/api/${VERSION}/orders/${orderId}.json`,
        {
            headers: {
                "X-Shopify-Access-Token": TOKEN
            }
        }
    );

    const data = await response.json();

    console.log("GET ORDER:");
    console.log(JSON.stringify(data, null, 2));

    return data.order;
}

module.exports = {
    createOrder,
    getOrder
};