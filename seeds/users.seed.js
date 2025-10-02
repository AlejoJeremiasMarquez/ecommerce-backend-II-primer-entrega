import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

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
},
{
    first_name: 'Carlos',
    last_name: 'Rodríguez',
    email: 'carlos@example.com',
    age: 32,
    password: bcrypt.hashSync('user123', 10),
    role: 'user'
}
];

const seedDatabase = async () => {
try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB');

    await User.deleteMany({});
    console.log('Usuarios anteriores eliminados');

    const users = await User.insertMany(usersData);
    console.log(`${users.length} usuarios creados exitosamente`);

    console.log('\n Usuarios de prueba:');
    console.log('━'.repeat(60));
    users.forEach(user => {
    console.log(`
    Nombre: ${user.first_name} ${user.last_name}
    Email: ${user.email}
    Rol: ${user.role}
    Password: ${user.role === 'admin' ? 'admin123' : 'user123'}
    `);
    });
    console.log('━'.repeat(60));

    await mongoose.connection.close();
    console.log('\n Desconectado de MongoDB');
    process.exit(0);
} catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
}
};

seedDatabase();