# 🐳 Guía Paso a Paso: Subir Imagen a Docker Hub

## 📋 Requisitos Previos

- [x] Docker instalado y corriendo
- [x] Cuenta en [Docker Hub](https://hub.docker.com/) (gratuita)
- [x] Proyecto funcionando localmente

## 🚀 Paso 1: Crear Cuenta en Docker Hub

1. Ve a [hub.docker.com](https://hub.docker.com/)
2. Click en "Sign Up"
3. Completa el registro (gratuito)
4. Verifica tu email
5. Anota tu **Docker ID** (username)

## 🔑 Paso 2: Login desde Terminal

```bash
# Login en Docker Hub
docker login

# Te pedirá:
# Username: tu-docker-id
# Password: tu-password

# Deberías ver:
# Login Succeeded
```

## 🏗️ Paso 3: Construir la Imagen

```bash
# Asegúrate de estar en la raíz del proyecto
cd /ruta/a/ecommerce-backend

# Construir la imagen con tu Docker ID
docker build -t tu-docker-id/ecommerce-backend:latest .

# Ejemplo:
# docker build -t johndev/ecommerce-backend:latest .

# Ver la imagen creada
docker images | grep ecommerce-backend
```

### Resultado esperado:
```
tu-docker-id/ecommerce-backend   latest    abc123def456   2 minutes ago   150MB
```

## ✅ Paso 4: Probar la Imagen Localmente

```bash
# Ejecutar la imagen
docker run -d \
  --name test-api \
  -p 8080:8080 \
  -e MONGODB_URI="mongodb://localhost:27017/ecommerce" \
  -e JWT_SECRET="test_secret" \
  tu-docker-id/ecommerce-backend:latest

# Verificar que funciona
curl http://localhost:8080/api/health

# Debería devolver:
# {"status":"success","message":"API funcionando correctamente"...}

# Detener y eliminar el contenedor de prueba
docker stop test-api
docker rm test-api
```

## 📤 Paso 5: Subir a Docker Hub

```bash
# Push de la imagen
docker push tu-docker-id/ecommerce-backend:latest

# Progreso:
# The push refers to repository [docker.io/tu-docker-id/ecommerce-backend]
# latest: digest: sha256:... size: 2204
```

### Si quieres versionar:

```bash
# Crear tag con versión
docker tag tu-docker-id/ecommerce-backend:latest tu-docker-id/ecommerce-backend:1.0.0

# Push de ambas versiones
docker push tu-docker-id/ecommerce-backend:latest
docker push tu-docker-id/ecommerce-backend:1.0.0
```

## 🔍 Paso 6: Verificar en Docker Hub

1. Ve a [hub.docker.com](https://hub.docker.com/)
2. Login con tu cuenta
3. Ve a "Repositories"
4. Deberías ver `ecommerce-backend`
5. Click en el repositorio
6. Verifica que esté el tag `latest`

**Tu imagen estará en:**
```
https://hub.docker.com/r/tu-docker-id/ecommerce-backend
```

## 📝 Paso 7: Actualizar el README

Actualiza el `README.md` del proyecto con el link correcto:

```markdown
## 🐋 Imagen Docker

**Docker Hub:** [https://hub.docker.com/r/TU-DOCKER-ID/ecommerce-backend](https://hub.docker.com/r/TU-DOCKER-ID/ecommerce-backend)

### Uso Rápido

\```bash
docker pull TU-DOCKER-ID/ecommerce-backend:latest
docker run -p 8080:8080 TU-DOCKER-ID/ecommerce-backend:latest
\```
```

## 🧪 Paso 8: Probar Descarga desde Docker Hub

```bash
# Eliminar imagen local (opcional)
docker rmi tu-docker-id/ecommerce-backend:latest

# Descargar desde Docker Hub
docker pull tu-docker-id/ecommerce-backend:latest

# Ejecutar
docker run -d -p 8080:8080 tu-docker-id/ecommerce-backend:latest

# Verificar
curl http://localhost:8080/api/health
```

## 📊 Comandos Útiles

### Ver información de la imagen

```bash
# Tamaño y detalles
docker images tu-docker-id/ecommerce-backend

# Historial de capas
docker history tu-docker-id/ecommerce-backend:latest

# Inspeccionar
docker inspect tu-docker-id/ecommerce-backend:latest
```

### Gestionar tags

```bash
# Ver todos los tags
docker images tu-docker-id/ecommerce-backend

# Crear nuevo tag
docker tag tu-docker-id/ecommerce-backend:latest tu-docker-id/ecommerce-backend:v1.0.0

# Eliminar tag local
docker rmi tu-docker-id/ecommerce-backend:v1.0.0
```

## 🔄 Actualizar la Imagen

Cuando hagas cambios en el código:

```bash
# 1. Reconstruir
docker build -t tu-docker-id/ecommerce-backend:latest .

# 2. Probar localmente
docker run -d -p 8080:8080 tu-docker-id/ecommerce-backend:latest

# 3. Si funciona, hacer push
docker push tu-docker-id/ecommerce-backend:latest
```

## 🎯 Checklist Final

- [ ] Cuenta en Docker Hub creada
- [ ] Login exitoso (`docker login`)
- [ ] Imagen construida localmente
- [ ] Imagen probada y funcionando
- [ ] Imagen subida a Docker Hub (`docker push`)
- [ ] Verificado en hub.docker.com
- [ ] README.md actualizado con el link
- [ ] Probada descarga desde Docker Hub

## 🆘 Problemas Comunes

### Error: "denied: requested access to the resource is denied"

**Solución:**
```bash
# Verificar que estás logueado
docker login

# Verificar el nombre de la imagen
# Debe ser: tu-docker-id/nombre-imagen
docker tag ecommerce-backend:latest tu-docker-id/ecommerce-backend:latest
docker push tu-docker-id/ecommerce-backend:latest
```

### Error: "no basic auth credentials"

**Solución:**
```bash
# Logout y login nuevamente
docker logout
docker login
```

### Imagen muy pesada (>500MB)

**Solución:**
- Usar multi-stage build (ya incluido en el Dockerfile)
- Verificar que .dockerignore esté configurado
- Usar Alpine Linux (ya incluido)

```bash
# Ver tamaño de capas
docker history tu-docker-id/ecommerce-backend:latest
```

## 📚 Recursos Adicionales

- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)

## 💡 Tips

1. **Descripción en Docker Hub**: Agrega una descripción detallada en Docker Hub
2. **README en Docker Hub**: Vincula tu repositorio de GitHub
3. **Tags semánticos**: Usa versionado semántico (1.0.0, 1.0.1, etc.)
4. **Automated builds**: Configura builds automáticos desde GitHub
5. **Badges**: Agrega badges de Docker en tu README

---

¡Listo! Tu imagen ya está en Docker Hub y lista para ser usada por cualquiera 🎉