import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Product from '../models/product.js';
import Cart from '../models/cart.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log('🗑️  Colecciones limpiadas');

    // Crear usuarios
    const usersData = [
      {
        first_name: 'Admin',
        last_name: 'Sistema',
        email: 'admin@ecommerce.com',
        age: 30,
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin'
      },
      {
        first_name: 'Juan',
        last_name: 'Pérez',
        email: 'juan@example.com',
        age: 25,
        password: bcrypt.hashSync('user123', 10),
        role: 'user'
      },
      {
        first_name: 'María',
        last_name: 'González',
        email: 'maria@example.com',
        age: 28,
        password: bcrypt.hashSync('user123', 10),
        role: 'user'
      }
    ];

    const users = await User.insertMany(usersData);
    console.log(`✨ ${users.length} usuarios creados`);

    // Crear carritos para los usuarios
    for (const user of users) {
      if (user.role === 'user') {
        const cart = await Cart.create({ user: user._id, products: [] });
        user.cart = cart._id;
        await user.save();
      }
    }
    console.log('🛒 Carritos creados para usuarios');

    // Crear productos
    const admin = users.find(u => u.role === 'admin');
    const productsData = [
      {
        title: 'Laptop HP Pavilion',
        description: 'Laptop potente para trabajo y entretenimiento',
        code: 'LAP001',
        price: 85000,
        stock: 15,
        category: 'Electrónica',
        thumbnails: ['laptop-hp.jpg'],
        owner: admin._id
      },
      {
        title: 'Mouse Logitech MX Master',
        description: 'Mouse ergonómico de alta precisión',
        code: 'MOU001',
        price: 12000,
        stock: 30,
        category: 'Accesorios',
        thumbnails: ['mouse-logitech.jpg'],
        owner: admin._id
      },
      {
        title: 'Teclado Mecánico RGB',
        description: 'Teclado mecánico gaming con iluminación RGB',
        code: 'TEC001',
        price: 18000,
        stock: 20,
        category: 'Accesorios',
        thumbnails: ['teclado-rgb.jpg'],
        owner: admin._id
      },
      {
        title: 'Monitor Samsung 27"',
        description: 'Monitor Full HD de 27 pulgadas',
        code: 'MON001',
        price: 45000,
        stock: 10,
        category: 'Electrónica',
        thumbnails: ['monitor-samsung.jpg'],
        owner: admin._id
      },
      {
        title: 'Auriculares Sony WH-1000XM4',
        description: 'Auriculares con cancelación de ruido',
        code: 'AUR001',
        price: 55000,
        stock: 8,
        category: 'Audio',
        thumbnails: ['auriculares-sony.jpg'],
        owner: admin._id
      },
      {
        title: 'Webcam Logitech C920',
        description: 'Webcam HD 1080p para videollamadas',
        code: 'WEB001',
        price: 15000,
        stock: 25,
        category: 'Accesorios',
        thumbnails: ['webcam-logitech.jpg'],
        owner: admin._id
      },
      {
        title: 'SSD Samsung 1TB',
        description: 'Disco sólido de alta velocidad',
        code: 'SSD001',
        price: 22000,
        stock: 18,
        category: 'Almacenamiento',
        thumbnails: ['ssd-samsung.jpg'],
        owner: admin._id
      },
      {
        title: 'Impresora HP LaserJet',
        description: 'Impresora láser monocromática',
        code: 'IMP001',
        price: 38000,
        stock: 5,
        category: 'Impresoras',
        thumbnails: ['impresora-hp.jpg'],
        owner: admin._id
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`📦 ${products.length} productos creados`);

    // Mostrar información
    console.log('\n📋 Datos de prueba creados:');
    console.log('━'.repeat(60));
    
    console.log('\n👥 USUARIOS:');
    users.forEach(user => {
      console.log(`
      Nombre: ${user.first_name} ${user.last_name}
      Email: ${user.email}
      Rol: ${user.role}
      Password: ${user.role === 'admin' ? 'admin123' : 'user123'}
      ${user.cart ? `Carrito ID: ${user.cart}` : ''}
      `);
    });

    console.log('\n📦 PRODUCTOS:');
    products.forEach(product => {
      console.log(`  - ${product.title} | ${product.price} | Stock: ${product.stock}`);
    });

    console.log('\n━'.repeat(60));
    console.log('\n✅ Base de datos poblada exitosamente');

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('\n👋 Desconectado de MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();