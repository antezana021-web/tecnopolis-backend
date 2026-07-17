const { v4: uuidv4 } = require("uuid");

const SHOP = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const VERSION = process.env.SHOPIFY_API_VERSION;

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

    console.log(data);

    return data.order.id;

}

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

    return data.order;

}

module.exports = {
    createOrder,
    getOrder
};