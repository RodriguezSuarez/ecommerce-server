// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://atilarosua:Atlas1975!@cluster0.6ejjl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error.message);
        process.exit(1); // Salir del proceso si no se puede conectar
    }
};

module.exports = connectDB;


