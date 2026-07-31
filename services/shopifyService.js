const SHOP = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

const API_URL = `https://${SHOP}/admin/api/2026-07`;

async function testShopifyConnection() {

    const response = await fetch(`${API_URL}/shop.json`, {

        method: "GET",

        headers: {
            "X-Shopify-Access-Token": TOKEN,
            "Content-Type": "application/json"
        }

    });

    if (!response.ok) {

        throw new Error("No se pudo conectar con Shopify");

    }

    const data = await response.json();

    return data.shop;
}
//____________________________________________________________________________________________________________________
async function getProducts() {
    const response = await fetch(`${API_URL}/products.json?limit=50`, {
        method: "GET",
        headers: {
            "X-Shopify-Access-Token": TOKEN,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();
    return data.products;
}
//_________________________________________________________
async function createShopifyOrder(orderData) {
    const {
        customer,
        shippingAddress,
        items,
        reference,
        notes
    } = orderData;

    if (!customer?.firstName || !customer?.lastName) {
        throw new Error("Faltan el nombre o apellido del cliente");
    }

    if (!customer?.email) {
        throw new Error("Falta el correo del cliente");
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error("El pedido no contiene productos");
    }

    const lineItems = items.map((item) => {
        const variantId = item.variant_id || item.variantId;
        const quantity = Number(item.quantity);

        if (!variantId) {
            throw new Error("Uno de los productos no tiene variant_id");
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            throw new Error("La cantidad de un producto no es válida");
        }

        return {
            variant_id: variantId,
            quantity
        };
    });

    const address = {
        first_name: customer.firstName,
        last_name: customer.lastName,
        address1: shippingAddress?.address1 || "",
        address2: shippingAddress?.address2 || "",
        phone: customer.phone || "",
        city: shippingAddress?.city || "",
        province: shippingAddress?.department || "",
        country: "Bolivia",
        country_code: "BO",
        zip: shippingAddress?.zip || ""
    };

    const response = await fetch(`${API_URL}/orders.json`, {
        method: "POST",

        headers: {
            "X-Shopify-Access-Token": TOKEN,
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            order: {
                email: customer.email,
                phone: customer.phone || undefined,

             customer: {
                first_name: customer.firstName,
                last_name: customer.lastName,
                email: customer.email,
                phone: customer.phone || undefined
            },

                financial_status: "pending",

                line_items: lineItems,

                inventory_behaviour: "decrement_obeying_policy",

                shipping_address: address,
                billing_address: address,

                note: notes || "Pago mediante QR pendiente de verificación",

                note_attributes: [
                    {
                        name: "Método de pago",
                        value: "QR"
                    },
                    {
                        name: "Referencia",
                        value: reference || "Sin referencia"
                    },
                    {
                        name: "Departamento",
                        value: shippingAddress?.department || "No indicado"
                    }
                ],

                tags: "Checkout personalizado, Pago QR pendiente",

                send_receipt: false,
                send_fulfillment_receipt: false
            }
        })
    });

    if (!response.ok) {
        const error = await response.text();

        console.error("Error de Shopify al crear la orden:", error);

        throw new Error(
            `Shopify rechazó la creación de la orden: ${error}`
        );
    }

    const data = await response.json();

console.log(
    "Respuesta completa de Shopify:",
    JSON.stringify(data, null, 2)
);

if (!data || !data.order) {
    throw new Error(
        `Shopify respondió sin una orden: ${JSON.stringify(data)}`
    );
}

return data.order;
}



//__________________________________________

module.exports = {
    testShopifyConnection,
    getProducts,
    createShopifyOrder
};