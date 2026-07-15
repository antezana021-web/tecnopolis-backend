const orderService = require("../services/orderService");

/**
 * Crear pedido
 */
const createOrder = (req, res) => {

    const orderId = orderService.createOrder(req.body);

    res.status(201).json({
        success: true,
        orderId
    });

};

/**
 * Obtener pedido
 */
const getOrder = (req, res) => {

    const { orderId } = req.params;

    const order = orderService.getOrder(orderId);

    if (!order) {

        return res.status(404).json({
            success: false,
            message: "Pedido no encontrado"
        });

    }

    res.json(order);

};

module.exports = {
    createOrder,
    getOrder
};