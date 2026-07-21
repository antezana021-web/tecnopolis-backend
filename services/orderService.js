const { v4: uuidv4 } = require("uuid");

// Memoria temporal de pedidos
const orders = {};

/**
 * Crear pedido
 */
function createOrder(orderData) {

    const orderId = uuidv4();

    orders[orderId] = orderData;

    return orderId;

}

/**
 * Obtener pedido
 */
function getOrder(orderId) {

    return orders[orderId];

}

module.exports = {
    createOrder,
    getOrder
};