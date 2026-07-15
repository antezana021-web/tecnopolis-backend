console.log("Hola, estoy ejecutando server.js");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const orderRoutes = require("./routes/orderRoutes");

const app = express();

// Permitir recibir datos en formato JSON
app.use(express.json());

// Permitir conexiones desde otros dominios
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
    res.json({
        mensaje: "API de Tecnopolis funcionando correctamente 🚀"
    });
});

app.use("/api/order", orderRoutes);
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});