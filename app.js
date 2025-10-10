import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from './config/passport.config.js';
import sessionsRoutes from './routes/sessions.routes.js';
import usersRoutes from './routes/users.routes.js';
import productsRoutes from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import ticketsRouter from './routes/tickets.routes.js';
import { passportErrorHandler, globalErrorHandler } from './middlewares/error.middleware.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// ========================================
// MIDDLEWARES
// ========================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public')); // Agregar esta línea

// Inicializar Passport
app.use(passport.initialize());

// ========================================
// RUTAS
// ========================================
// Ruta raíz que sirve el index.html
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.use('/api/sessions', sessionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRouter);
app.use('/api/tickets', ticketsRouter);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ========================================
// MANEJO DE ERRORES
// ========================================
app.use(passportErrorHandler);
app.use(globalErrorHandler);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada'
  });
});

// ========================================
// CONEXIÓN A BASE DE DATOS Y SERVIDOR
// ========================================
const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

startServer();

export default app;