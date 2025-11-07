# 🐳 E-commerce Backend - Docker Edition

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://hub.docker.com/r/tu-usuario/ecommerce-backend)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-ISC-yellow)](LICENSE)

Sistema completo de e-commerce con arquitectura profesional, implementando patrones DAO, DTO y Repository, sistema de compras y recuperación de contraseñas. **¡Ahora con Docker!** 🚀

## 📋 Índice

- [Imagen Docker](#-imagen-docker)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación con Docker](#-instalación-con-docker)
- [Testing](#-testing)
- [Documentación de la API](#-documentación-de-la-api)
- [Variables de Entorno](#-variables-de-entorno)
- [Estructura del Proyecto](#-estructura-del-proyecto)

## 🐋 Imagen Docker

### Docker Hub

La imagen oficial del proyecto está disponible en Docker Hub:

```bash
docker pull tu-usuario/ecommerce-backend:latest
```

**🔗 Link a Docker Hub:** [https://hub.docker.com/r/tu-usuario/ecommerce-backend](https://hub.docker.com/r/tu-usuario/ecommerce-backend)

### Características de la Imagen

- ✅ **Multi-stage build** para optimización de tamaño
- ✅ **Alpine Linux** base (imagen ligera ~150MB)
- ✅ **Usuario no-root** para seguridad
- ✅ **Health checks** integrados
- ✅ **Dumb-init** para manejo correcto de señales
- ✅ **Variables de entorno** configurables

## 🔧 Requisitos Previos

- Docker 20.10+ instalado
- Docker Compose 2.0+ (opcional, pero recomendado)
- MongoDB (incluido en docker-compose)

## 🚀 Instalación con Docker

### Opción 1: Docker Compose (Recomendado)

La forma más fácil de ejecutar el proyecto con MongoDB incluido:

```bash
# 1. Clonar el repositorio
git clone <tu-repositorio>
cd ecommerce-backend

# 2. Crear archivo .env (ver sección Variables de Entorno)
cp .env.example .env

# 3. Iniciar todos los servicios
docker-compose up -d

# 4. Ver logs
docker-compose logs -f api

# 5. Verificar que funciona
curl http://localhost:8080/api/health
```

**Servicios incluidos:**
- 🐳 API Backend (puerto 8080)
- 🗄️ MongoDB (puerto 27017)

### Opción 2: Docker Run (Solo API)

Si ya tienes MongoDB corriendo en otro lugar:

```bash
# 1. Descargar la imagen
docker pull tu-usuario/ecommerce-backend:latest

# 2. Ejecutar el contenedor
docker run -d \
  --name ecommerce-api \
  -p 8080:8080 \
  -e MONGODB_URI="mongodb://localhost:27017/ecommerce" \
  -e JWT_SECRET="tu_secret_key" \
  tu-usuario/ecommerce-backend:latest

# 3. Ver logs
docker logs -f ecommerce-api
```

### Opción 3: Build desde código fuente

```bash
# 1. Construir la imagen
docker build -t ecommerce-backend:local .

# 2. Ejecutar
docker run -d -p 8080:8080 --env-file .env ecommerce-backend:local
```

## 📦 Construir y Subir tu Propia Imagen

### Paso 1: Construir la Imagen

```bash
# Build con tag
docker build -t tu-usuario/ecommerce-backend:latest .

# Build con múltiples tags
docker build -t tu-usuario/ecommerce-backend:latest -t tu-usuario/ecommerce-backend:1.0.0 .
```

### Paso 2: Probar Localmente

```bash
# Ejecutar
docker run -p 8080:8080 --env-file .env tu-usuario/ecommerce-backend:latest

# Verificar
curl http://localhost:8080/api/health
```

### Paso 3: Login en Docker Hub

```bash
docker login
# Ingresa tu Docker ID y password
```

### Paso 4: Subir a Docker Hub

```bash
# Push de la imagen
docker push tu-usuario/ecommerce-backend:latest

# Push de versión específica
docker push tu-usuario/ecommerce-backend:1.0.0
```

### Paso 5: Verificar en Docker Hub

Visita: `https://hub.docker.com/r/tu-usuario/ecommerce-backend`

## 🧪 Testing

El proyecto incluye tests funcionales completos para todos los endpoints, especialmente el flujo de adopción (compras).

### Ejecutar Tests

```bash
# Instalar dependencias de testing
npm install --save-dev mocha chai supertest nyc

# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage
```

### Tests Implementados

#### ✅ Adoption Router (Compras)
- `GET /api/carts/:cid` - Obtener carrito
- `POST /api/carts/:cid/products/:pid` - Agregar producto
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto
- `DELETE /api/carts/:cid` - Vaciar carrito
- `POST /api/carts/:cid/purchase` - **Finalizar compra (ADOPTION)**
- `GET /api/tickets/my-tickets` - Obtener mis tickets
- Flujo E2E completo de adopción

#### Cobertura de Tests
- ✅ Casos de éxito
- ✅ Casos de error
- ✅ Validación de autenticación
- ✅ Validación de autorización por roles
- ✅ Flujos completos (E2E)

### Ejemplo de Salida de Tests

```
Testing Adoption Router
  GET /api/carts/:cid
    ✓ Debe obtener el carrito del usuario autenticado
    ✓ Debe fallar sin autenticación
    ✓ Debe fallar con carrito inexistente
  POST /api/carts/:cid/products/:pid
    ✓ Debe agregar un producto al carrito (solo user)
    ✓ Debe fallar si el admin intenta agregar al carrito
    ✓ Debe fallar sin autenticación
  POST /api/carts/:cid/purchase
    ✓ Debe finalizar la compra exitosamente
    ✓ Debe generar un ticket con código único
    ✓ Debe descontar stock automáticamente
  FLUJO COMPLETO DE ADOPCIÓN (E2E)
    ✓ Debe completar el flujo: agregar → ver carrito → comprar → verificar ticket

  15 passing (2.5s)
```

## 📚 Documentación de la API

### Swagger UI

La documentación interactiva de la API está disponible en:

```
http://localhost:8080/api-docs
```

### Endpoints Documentados

#### Módulo de Users (Swagger)
- `POST /api/sessions/register` - Registrar usuario
- `POST /api/sessions/login` - Login
- `GET /api/sessions/current` - Usuario actual (DTO)
- `POST /api/sessions/logout` - Logout
- `POST /api/sessions/forgot-password` - Recuperar contraseña
- `POST /api/sessions/reset-password/:token` - Restablecer contraseña
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario (admin)

#### Módulo de Products
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

#### Módulo de Carts & Adoption
- `POST /api/carts` - Crear carrito
- `GET /api/carts/:cid` - Obtener carrito
- `POST /api/carts/:cid/products/:pid` - Agregar producto (user)
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto
- `DELETE /api/carts/:cid` - Vaciar carrito
- `POST /api/carts/:cid/purchase` - **Finalizar compra**

#### Módulo de Tickets
- `GET /api/tickets/my-tickets` - Mis tickets
- `GET /api/tickets` - Todos los tickets (admin)
- `GET /api/tickets/:id` - Ticket por ID

## 🔐 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Server
PORT=8080
NODE_ENV=production

# Database
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/ecommerce?authSource=admin

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
JWT_EXPIRATION=24h

# Email (para recuperación de contraseña)
EMAIL_SERVICE=gmail
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_password_de_aplicacion

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Configurar Gmail para Emails

1. Ir a tu cuenta de Google → Seguridad
2. Activar "Verificación en dos pasos"
3. Generar una "Contraseña de aplicación"
4. Usar esa contraseña en `EMAIL_PASSWORD`

## 🏗️ Estructura del Proyecto

```
ecommerce-backend/
├── app.js                     # App principal
├── Dockerfile                 # Imagen Docker optimizada
├── docker-compose.yml         # Orquestación local
├── .dockerignore              # Archivos ignorados por Docker
├── package.json               # Dependencias
├── .env                       # Variables de entorno
│
├── config/
│   └── passport.config.js     # Estrategias de Passport
│
├── dao/                       # Data Access Objects
│   ├── User.dao.js
│   ├── Cart.dao.js
│   ├── Product.dao.js
│   └── Ticket.dao.js
│
├── dtos/                      # Data Transfer Objects
│   └── User.dto.js
│
├── repositories/              # Patrón Repository
│   ├── User.repository.js
│   ├── Cart.repository.js
│   ├── Product.repository.js
│   └── Ticket.repository.js
│
├── controllers/               # Controladores
│   ├── sessions.controller.js
│   ├── users.controller.js
│   ├── products.controller.js
│   ├── carts.controller.js
│   └── tickets.controller.js
│
├── routes/                    # Rutas
│   ├── sessions.routes.js
│   ├── users.routes.js
│   ├── products.routes.js
│   ├── carts.routes.js
│   └── tickets.routes.js
│
├── middlewares/               # Middlewares
│   ├── auth.middleware.js
│   └── error.middleware.js
│
├── models/                    # Modelos
│   ├── User.js
│   ├── Cart.js
│   ├── Product.js
│   └── Ticket.js
│
├── services/                  # Servicios
│   └── email.service.js
│
├── seeds/                     # Seeds
│   └── users.seed.js
│
└── test/                      # Tests
    └── adoption.test.js       # Tests del router de adoption
```

## 🎯 Comandos Útiles Docker

### Gestión de Contenedores

```bash
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores
docker ps -a

# Ver logs
docker logs ecommerce-api
docker logs -f ecommerce-api  # follow mode

# Entrar al contenedor
docker exec -it ecommerce-api sh

# Detener contenedor
docker stop ecommerce-api

# Reiniciar contenedor
docker restart ecommerce-api

# Eliminar contenedor
docker rm ecommerce-api
```

### Docker Compose

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
docker-compose logs -f api      # solo API
docker-compose logs -f mongodb  # solo MongoDB

# Detener servicios
docker-compose stop

# Detener y eliminar
docker-compose down

# Reconstruir imágenes
docker-compose build --no-cache

# Ver estado
docker-compose ps
```

### Gestión de Imágenes

```bash
# Listar imágenes
docker images

# Eliminar imagen
docker rmi ecommerce-backend:latest

# Limpiar imágenes no usadas
docker image prune

# Ver espacio usado
docker system df
```

## 🔥 Características de la Imagen Docker

### Optimizaciones

1. **Multi-stage build**: Reduce el tamaño final de la imagen
2. **Alpine Linux**: Base ligera (~150MB vs ~900MB con node:18)
3. **npm ci**: Instalación más rápida y reproducible
4. **Cache layers**: Aprovecha el cache de Docker para builds rápidos
5. **Usuario no-root**: Mejora la seguridad

### Seguridad

- ✅ Usuario no-root (nodejs)
- ✅ Sin privilegios elevados
- ✅ Health checks integrados
- ✅ Manejo correcto de señales (dumb-init)
- ✅ Variables de entorno seguras

### Performance

- ✅ Solo dependencias de producción
- ✅ Imagen optimizada (~150MB)
- ✅ Health checks para orchestrators
- ✅ Restart policies configurables

## 🚢 Despliegue en Producción

### Con Docker Hub

```bash
# 1. Pull de la imagen
docker pull tu-usuario/ecommerce-backend:latest

# 2. Ejecutar con tus variables de entorno
docker run -d \
  --name ecommerce-api \
  --restart unless-stopped \
  -p 8080:8080 \
  -e MONGODB_URI="mongodb://tu-mongo-uri" \
  -e JWT_SECRET="tu_secret_production" \
  -e NODE_ENV="production" \
  tu-usuario/ecommerce-backend:latest
```

### Con Docker Compose en Producción

```bash
# 1. Ajustar docker-compose.yml para producción
# 2. Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### Plataformas Cloud Compatibles

- ✅ **AWS ECS/Fargate**: Usar imagen de Docker Hub
- ✅ **Google Cloud Run**: Deploy directo desde Docker Hub
- ✅ **Azure Container Instances**: Compatible
- ✅ **Railway.app**: Detección automática de Dockerfile
- ✅ **Render**: Deploy desde Docker Hub
- ✅ **DigitalOcean App Platform**: Compatible

## 📊 Monitoreo y Health Checks

### Health Check Endpoint

```bash
curl http://localhost:8080/api/health
```

Respuesta:
```json
{
  "status": "success",
  "message": "API funcionando correctamente",
  "timestamp": "2025-01-10T10:00:00.000Z"
}
```

### Docker Health Check

El Dockerfile incluye un health check automático:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', ...)"
```

Ver estado:
```bash
docker inspect --format='{{.State.Health.Status}}' ecommerce-api
```

## 🎓 Testing en Docker

### Opción 1: Tests antes del build

```bash
# Ejecutar tests localmente
npm test

# Si pasan, construir imagen
docker build -t ecommerce-backend:latest .
```

### Opción 2: Tests en contenedor

```bash
# Crear imagen de testing
docker build --target builder -t ecommerce-backend:test .

# Ejecutar tests
docker run --rm ecommerce-backend:test npm test
```

## 🔄 CI/CD con Docker

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v2
        with:
          context: .
          push: true
          tags: alejomarquez/ecommerce-backend:latest
```

## 📝 Notas Importantes

### Producción

1. **Cambiar JWT_SECRET**: Usar un valor seguro y aleatorio
2. **Configurar MongoDB**: Usar MongoDB Atlas o servidor dedicado
3. **HTTPS**: Usar un reverse proxy (nginx) con SSL
4. **Logs**: Configurar agregación de logs (ELK, CloudWatch, etc.)
5. **Backups**: Configurar backups automáticos de MongoDB
6. **Monitoreo**: Implementar métricas y alertas

### Seguridad

1. No exponer MongoDB directamente (usar red interna de Docker)
2. Usar secrets de Docker para credenciales sensibles
3. Mantener la imagen actualizada (npm audit, docker scan)
4. Limitar recursos del contenedor (CPU, memoria)

## 🆘 Troubleshooting

### El contenedor no inicia

```bash
# Ver logs detallados
docker logs ecommerce-api

# Verificar variables de entorno
docker exec ecommerce-api env

# Verificar conectividad a MongoDB
docker exec ecommerce-api ping mongodb
```

### MongoDB no conecta

```bash
# Verificar que MongoDB esté corriendo
docker ps | grep mongodb

# Ver logs de MongoDB
docker logs ecommerce-mongodb

# Verificar red
docker network inspect ecommerce-network
```

### Health check falla

```bash
# Ejecutar health check manualmente
docker exec ecommerce-api curl http://localhost:8080/api/health

# Ver estado del health check
docker inspect --format='{{json .State.Health}}' ecommerce-api | jq
```

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)

## 👨‍💻 Autor

**Entrega Final** - Diseño y Arquitectura Backend  
E-commerce con Docker y Testing Completo

## 📄 Licencia

ISC

---

**🐳 Imagen Docker Hub:** [https://hub.docker.com/r/tu-usuario/ecommerce-backend](https://hub.docker.com/r/tu-usuario/ecommerce-backend)