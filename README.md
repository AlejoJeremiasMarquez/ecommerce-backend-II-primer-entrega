# 🛒 E-commerce Backend - Entrega Final

Sistema completo de e-commerce con arquitectura profesional, implementando patrones DAO, DTO y Repository, sistema de compras y recuperación de contraseñas.

## 🎯 Características Implementadas (Entrega Final)

### ✅ Arquitectura Profesional
- **Patrón DAO** (Data Access Object) - Capa de acceso a datos
- **Patrón DTO** (Data Transfer Object) - Transferencia segura de datos
- **Patrón Repository** - Lógica de negocio separada
- **Separación de responsabilidades** en capas

### ✅ Sistema de Compras
- Modelo **Ticket** con código único autogenerado
- Endpoint `POST /api/carts/:cid/purchase` para finalizar compra
- Verificación de stock en tiempo real
- Descuento automático de stock
- Manejo de productos sin stock disponible
- Email de confirmación de compra

### ✅ Recuperación de Contraseña
- Envío de email con token de recuperación
- Token con expiración de 1 hora
- Validación de contraseña anterior
- Sistema seguro con hashing

### ✅ Sistema de Autorización Mejorado
- **Admin**: Crear, actualizar y eliminar productos
- **User**: Agregar productos al carrito
- Middleware de autorización por roles
- Protección de endpoints sensibles

### ✅ Gestión de Productos
- CRUD completo de productos
- Control de stock
- Productos asociados a usuarios admin

### ✅ Gestión de Carritos
- Crear y gestionar carritos
- Agregar/eliminar productos
- Finalizar compra con verificación de stock

## 📁 Estructura del Proyecto (Nueva Arquitectura)

```
ecommerce-backend/
├── app.js                          # Aplicación principal
├── package.json