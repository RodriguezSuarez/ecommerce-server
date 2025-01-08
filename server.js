const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const viewsRouter = require('./routes/views'); // Importar el router de vistas
const ProductManager = require('./ProductManager'); // Asegúrate de tener este archivo como se definió anteriormente

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Inicializa Socket.IO

const productManager = new ProductManager(); // Instancia de ProductManager

// Configuración de Handlebars
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    extname: '.handlebars'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para manejar formularios
app.use(express.static(path.join(__dirname, 'public'))); // Para archivos estáticos

// Usar el router de vistas
app.use('/', viewsRouter); // Montar el router en la ruta raíz

// Manejo de WebSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado'); // Mensaje en consola al conectar un cliente

    // Enviar lista inicial de productos al cliente
    socket.emit('updateProducts', productManager.products);

    socket.on('addProduct', (product) => {
        try {
            const newProduct = productManager.addProduct(product);
            io.emit('updateProducts', productManager.products); // Notificar a todos los clientes sobre el nuevo producto
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('deleteProduct', (productId) => {
        try {
            productManager.deleteProduct(productId);
            io.emit('updateProducts', productManager.products); // Notificar a todos los clientes sobre la eliminación del producto
        } catch (error) {
            console.error(error.message);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
