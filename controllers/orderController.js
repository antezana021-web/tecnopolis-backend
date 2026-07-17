const orderService = require("../services/orderService");

const createOrder = async (req, res) => {

    try {

        const result = await orderService.createOrder(req.body);

        res.status(201).json({
            success: true,
            ...result
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

    res.json({
        success: true
    });

};

module.exports = {
    createOrder,
    getOrder
};