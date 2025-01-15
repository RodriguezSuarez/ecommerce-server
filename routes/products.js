// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Importar modelo de producto

// Obtener todos los productos con filtros, paginación y ordenamientos
router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, filter } = req.query;

    try {
        const queryOptions = {};
        
        if (filter) {
            queryOptions.title = new RegExp(filter, 'i'); // Filtrar por título usando expresiones regulares
        }

        const products = await Product.find(queryOptions)
            .sort(sort)
            .limit(parseInt(limit))
            .skip((page - 1) * limit);

        const totalProducts = await Product.countDocuments(queryOptions);

        res.status(200).json({
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
        
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
        
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });

        res.status(204).send(); // No content response for successful deletion
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
