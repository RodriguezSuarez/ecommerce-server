// routes/carts.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart'); // Importar modelo de carrito
const Product = require('../models/Product'); // Importar modelo de producto

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = new Cart({ products: [] }); // Inicializar carrito vacío
        await newCart.save();
        
        res.status(201).json(newCart); // Devolver el carrito creado
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener un carrito por ID
router.get('/:id', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id).populate('products.productId'); // Población para obtener detalles del producto
        
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await Cart.findById(cartId);
        const product = await Product.findById(productId);

        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (existingProductIndex !== -1) {
            // Si existe, incrementar la cantidad
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // Si no existe, agregarlo como nuevo producto
            cart.products.push({ productId, quantity: 1 });
        }

        await cart.save(); // Guardar cambios en el carrito

        res.status(200).json(cart); // Devolver el carrito actualizado
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await Cart.findById(cartId);
        
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        // Buscar el índice del producto en el carrito
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

        if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        // Eliminar el producto del carrito
        cart.products.splice(productIndex, 1);

        await cart.save(); // Guardar cambios en el carrito

        res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      console.error(error);  
      res.status(500).json({ error : "Error al eliminar el producto del carrito" });
   }
});

// Eliminar un carrito por ID
router.delete('/:id', async (req, res) => {
   try {
       const deletedCart = await Cart.findByIdAndDelete(req.params.id);
       
       if (!deletedCart) return res.status(404).json({ error : "Carrito no encontrado" });

       res.status(204).send(); 
   } catch (error) {
       console.error(error);  
       res.status(500).json({ error : "Error al eliminar el carrito" });
   }
});

module.exports = router; 
