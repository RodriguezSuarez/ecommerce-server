const express = require('express');
const fs = require('fs');
const router = express.Router();
const ProductManager = require('../ProductManager'); // Importar ProductManager

const productManager = new ProductManager(); // Crear instancia de ProductManager

// Función para leer carritos desde el archivo JSON
const readCartsFromFile = () => {
    if (fs.existsSync('carts.json')) {
        const data = fs.readFileSync('carts.json', 'utf8');
        return JSON.parse(data);
    }
    return [];
};

// Función para escribir carritos al archivo JSON
const writeCartsToFile = (carts) => {
    fs.writeFileSync('carts.json', JSON.stringify(carts, null, 2));
};

// Ruta para crear un nuevo carrito vacío 
router.post('/', (req, res) => {
    const carts = readCartsFromFile(); // Leer carritos desde el archivo

    const newCart = {
        id: carts.length > 0 ? Math.max(...carts.map(c => c.id)) + 1 : 1,
        products: [] // Inicialmente vacío 
    };

    carts.push(newCart); // Agregar nuevo carrito a la lista
    writeCartsToFile(carts); // Escribir la lista actualizada al archivo
    
    res.status(201).json(newCart); // Devolver el nuevo carrito creado con estado 201 (creado)
});

// Ruta para listar los productos dentro de un carrito específico por su ID 
router.get('/:cid', (req, res) => {
    const carts = readCartsFromFile(); // Leer carritos desde el archivo 
    const cartId = parseInt(req.params.cid);
    
    const cart = carts.find(c => c.id === cartId); 

   if (!cart) {
       return res.status(404).json({ error: 'Carrito no encontrado' }); 
   }

   // Reemplazar IDs por información completa del producto
   const fullProductsInfo = cart.products.map(cartItem => ({
       ...cartItem,
       product: productManager.getProductById(cartItem.product), // Obtener información completa del producto por ID
   }));

   res.status(200).json(fullProductsInfo); // Devolver los productos completos del carrito 
});

// Ruta para agregar un producto al carrito específico 
router.post('/:cid/product/:pid', (req, res) => {
   const carts = readCartsFromFile(); 
   const cartId = parseInt(req.params.cid); 
   const productId = parseInt(req.params.pid);
   
   const cartIndex = carts.findIndex(c => c.id === cartId); 

   if (cartIndex === -1) {
       return res.status(404).json({ error: 'Carrito no encontrado' }); 
   }

   // Buscar si el producto ya existe en el carrito 
   const existingProductIndex = carts[cartIndex].products.findIndex(p => p.product === productId);

   if (existingProductIndex !== -1) { 
       carts[cartIndex].products[existingProductIndex].quantity += 1; 
       writeCartsToFile(carts); // Escribir la lista actualizada al archivo
       return res.status(200).json(carts[cartIndex].products[existingProductIndex]); 
   }

   const newProduct = { 
       product: productId,
       quantity: 1 
   };

   carts[cartIndex].products.push(newProduct); 
    
   writeCartsToFile(carts); // Escribir la lista actualizada al archivo
    
   res.status(201).json(newProduct); 
});

module.exports = router; 
