const { v4: uuidv4 } = require("uuid");

// Aquí guardaremos temporalmente las órdenes.
// Más adelante esto será Supabase.
const orders = {};

/**
 * Crear una nueva orden
 */
function createOrder(orderData) {

    const orderId = uuidv4();

    orders[orderId] = orderData;

    return orderId;
}

/**
 * Buscar una orden por ID
 */
function getOrder(orderId) {

    return orders[orderId];

}

module.exports = {
    createOrder,
    getOrder
};