// routes/views.js
const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager'); // Asegúrate de tener este archivo como se definió anteriormente

const productManager = new ProductManager(); // Instancia de ProductManager

// Ruta raíz
router.get('/', (req, res) => {
    res.render('home'); // Renderiza la vista 'home.handlebars'
});

// Ruta para productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts'); // Renderiza la vista 'realTimeProducts.handlebars'
});

module.exports = router; // Exportar el router para usarlo en server.js
