const orderService = require("../services/orderService");

const createOrder = async (req, res) => {

    try {

        const orderId = await orderService.createOrder(req.body);

        res.status(201).json({
            success: true,
            orderId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getOrder = (req, res) => {

    const { orderId } = req.params;

    const order = orderService.getOrder(orderId);

    if (!order) {

        return res.status(404).json({
            success: false,
            message: "Pedido no encontrado"
        });

    }

    res.json({
        success: true,
        order
    });

};

module.exports = {
    createOrder,
    getOrder
};