const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager'); // Importar ProductManager

const productManager = new ProductManager(); // Crear instancia de ProductManager

// Ruta para listar todos los productos con limitación opcional
router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit); // Obtener límite desde query
    const products = productManager.getAllProducts(limit); // Obtener productos
    res.status(200).json(products); // Responder con productos en formato JSON
});

// Ruta para obtener un producto por su ID
router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid); // Obtener ID del producto
    const product = productManager.getProductById(productId); // Buscar producto
    
    if (product) {
        res.status(200).json(product); // Responder con el producto encontrado
    } else {
        res.status(404).json({ error: 'Producto no encontrado' }); // Responder con error si no se encuentra
    }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        const newProduct = productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
        
        res.status(201).json(newProduct); // Responder con el nuevo producto creado
    } catch (error) {
        res.status(400).json({ error: error.message }); // Responder con error si ocurre un problema
    }
});

// Ruta para actualizar un producto existente por su ID
router.put('/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid); // Obtener ID del producto
        const updatedFields = req.body; // Obtener campos a actualizar
        
        const updatedProduct = productManager.updateProduct(productId, updatedFields); // Actualizar producto
        
        res.status(200).json(updatedProduct); // Responder con el producto actualizado
    } catch (error) {
        res.status(404).json({ error: error.message }); // Responder con error si no se encuentra el producto o hay otro problema
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid); // Obtener ID del producto
        productManager.deleteProduct(productId); // Eliminar producto
        
        res.status(204).send(); // Responder con estado 204 (sin contenido)
    } catch (error) {
        res.status(404).json({ error: error.message }); // Responder con error si no se encuentra el producto o hay otro problema
    }
});

module.exports = router;
