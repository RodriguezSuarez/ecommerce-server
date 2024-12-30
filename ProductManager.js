const fs = require('fs');

class ProductManager {
    constructor() {
        this.products = this.loadProducts(); // Cargar productos desde el archivo al iniciar
    }

    loadProducts() {
        if (fs.existsSync('products.json')) {
            const data = fs.readFileSync('products.json', 'utf8');
            return JSON.parse(data);
        }
        return [];
    }

    saveProducts() {
        fs.writeFileSync('products.json', JSON.stringify(this.products, null, 2));
    }

    getAllProducts(limit) {
        return limit ? this.products.slice(0, limit) : this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    addProduct(product) {
        if (this.isCodeRegistered(product.code)) {
            throw new Error('El código del producto ya existe.');
        }
        const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        const newProduct = { ...product, id: newId };
        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');
        
        // Validar tipos
        if (updatedFields.price !== undefined && typeof updatedFields.price !== 'number') {
            throw new Error('El precio debe ser un número.');
        }

        // Actualizar solo los campos permitidos
        Object.assign(this.products[index], updatedFields);
        this.saveProducts();
        return this.products[index];
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Producto no encontrado');
        
        this.products.splice(index, 1);
        this.saveProducts();
    }

    isCodeRegistered(code) {
        return this.products.some(p => p.code === code);
    }
}

module.exports = ProductManager;