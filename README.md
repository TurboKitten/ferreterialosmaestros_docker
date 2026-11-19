# Ferretería Los Maestros · despliegue Docker

Stack completo de la aplicación (React + Spring Boot + MySQL) empaquetado con
Docker Compose. Este repositorio se usa para **construir las imágenes** y
**desplegar la demo** en una instancia Ubuntu (AWS Learner Lab).

```text
Navegador ──▶ frontend (Nginx :80) ──/api──▶ backend (Spring Boot :8080) ──▶ db (MySQL :3306)
                    │                                                          └─ volumen db_data
                    └─ /swagger-ui/ y /v3/api-docs ──▶ backend
```

Solo el puerto **80** queda expuesto. La base de datos y el backend no tienen
puertos publicados: viven en la red interna de Compose.

## Decisiones de arquitectura

### Despliegue en un solo host con Docker Compose

**Decisión:** los tres servicios (frontend, backend y base de datos) se despliegan
en una única instancia EC2 usando Docker Compose.

**Alternativa evaluada:** dos instancias EC2 separadas, una para el frontend y otra
para el backend.

**Por qué se descartó para esta entrega:**

- La separación de responsabilidades ya existe a nivel de contenedores: cada
  servicio corre aislado y solo el frontend expone un puerto público.
- En AWS Learner Lab la IP pública cambia al detener e iniciar la instancia. Un
  `proxy_pass` de Nginx hacia otra máquina obligaría a reconstruir la imagen del
  frontend cada vez.
- La base de datos necesitaría una tercera instancia o compartir host con el
  backend, sin aportar aislamiento real.
- Habría que abrir el puerto 8080 entre instancias y mantener dos Security Groups,
  dos sesiones SSH y dos puntos de falla para una demo de duración limitada.
- El proyecto de referencia del curso (`dsy1104-docker-fullstack`) usa el mismo
  patrón: un host, tres contenedores y solo el puerto 80 publicado.

**En producción real:** la evolución natural sería separar frontend, backend y base
de datos en subredes privadas detrás de un balanceador de carga, con secretos
gestionados y CI/CD. Queda documentado como trabajo futuro, no como una omisión.

## Estructura

```text
.
├── ferreterialosmaestros_backend/   # API Spring Boot (Maven, Java 21)
│   ├── Dockerfile                   # multi-stage: Maven -> JRE
│   └── src/
├── FerreteriaLosMaestros/           # React + Vite
│   ├── Dockerfile                   # multi-stage: Node -> Nginx
│   ├── nginx.conf                   # try_files + proxy /api y Swagger
│   └── src/
├── docker-compose.yml               # desarrollo: construye desde el código
├── docker-compose.prod.yml          # despliegue: imágenes desde Docker Hub
├── .env.example                     # plantilla de variables (el .env real no se sube)
└── .gitignore
```

## Requisitos

- Docker Engine o Docker Desktop con el plugin Compose (`docker compose version`).
- Git.
- No necesitas Java, Maven ni Node instalados para ejecutar con Docker.

## Uso local (desarrollo)

```bash
cp .env.example .env      # ajusta las claves si quieres
docker compose up -d --build
docker compose ps
```

> En Windows/PowerShell: `Copy-Item .env.example .env`.

| Qué | URL |
| --- | --- |
| Aplicación | http://localhost |
| Swagger | http://localhost/swagger-ui.html |
| API | http://localhost/api/v1/productos |

Credenciales de demo:

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin` | `admin123` | Administrador |
| `aabarca` | `1234` | Administrador |
| `dgarrid` | `1234` | Vendedor |
| `cliente` | `1234` | Cliente |

Detener:

```bash
docker compose down        # conserva los datos
docker compose down -v     # borra también el volumen db_data
```

## Despliegue (Opción 2: imágenes en Docker Hub)

### 1. Construir y publicar las imágenes (en tu PC)

```bash
docker login

docker build --platform linux/amd64 -t TU_USUARIO/ferreteria-api:1.0.0 ./ferreterialosmaestros_backend
docker build --platform linux/amd64 -t TU_USUARIO/ferreteria-web:1.0.0 --build-arg VITE_API_URL=/api ./FerreteriaLosMaestros

docker push TU_USUARIO/ferreteria-api:1.0.0
docker push TU_USUARIO/ferreteria-web:1.0.0
```

> `--platform linux/amd64` es obligatorio si tu equipo pudiera construir para ARM.

### 2. Preparar el servidor

En una instancia Ubuntu con Docker instalado, solo hacen falta dos archivos:

```bash
mkdir -p ~/ferreteria && cd ~/ferreteria
# copiar docker-compose.prod.yml y .env (scp o nano)
chmod 600 .env
```

Contenido mínimo del `.env` de producción:

```env
DOCKERHUB_USER=tu_usuario_dockerhub
IMAGE_TAG=1.0.0

DB_NAME=ferreteria_los_maestros
DB_USER=ferreteria_user
DB_PASSWORD=<clave_larga>
DB_ROOT_PASSWORD=<otra_clave_larga>
JWT_SECRET=<64+ caracteres aleatorios>
JWT_EXPIRATION=86400000
DDL_AUTO=update
SHOW_SQL=false
```

### 3. Levantar

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
```

Espera a ver `Started FerreterialosmaestrosApplication`. La primera vez, la base
vacía se siembra con los 8 productos y los usuarios de demo.

| Qué | URL |
| --- | --- |
| Aplicación | `http://IP_PUBLICA` |
| Swagger | `http://IP_PUBLICA/swagger-ui.html` |
| API | `http://IP_PUBLICA/api/v1/productos` |

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `DOCKERHUB_USER`, `IMAGE_TAG` | Imágenes usadas por `docker-compose.prod.yml` |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_ROOT_PASSWORD` | Credenciales de MySQL y de la API |
| `JWT_SECRET`, `JWT_EXPIRATION` | Firma y vigencia de los tokens JWT |
| `DDL_AUTO`, `SHOW_SQL` | Hibernate en runtime (`update`, `false` en producción) |
| `BACKEND_PORT`, `FRONTEND_PORT` | Puertos publicados solo en desarrollo |
| `VITE_API_URL` | URL base de la API; se incrusta al compilar el frontend |

## Operación

```bash
# Estado y logs
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=100 backend

# Detener / iniciar sin borrar datos
docker compose -f docker-compose.prod.yml stop
docker compose -f docker-compose.prod.yml start

# Respaldo de la base
docker compose -f docker-compose.prod.yml exec -T db \
  sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' > respaldo.sql

# Borrar todo (incluye la base de datos)
docker compose -f docker-compose.prod.yml down -v
```

Para publicar una nueva versión: construye y sube con otro `IMAGE_TAG`, actualiza
`IMAGE_TAG` en `.env` y ejecuta `pull` + `up -d`.

## Notas para AWS Learner Lab

- La sesión y las credenciales son temporales; la IP pública cambia al detener e
  iniciar la instancia.
- Security Group: `22` solo desde tu IP y `80` desde cualquier origen.
  **No abras 3306 ni 8080.**
- Instancia recomendada: `t3.medium` (2 vCPU, 4 GB) con 20 GiB de disco.
- Al terminar el lab se pierden la instancia y el volumen: guarda un respaldo
  (`mysqldump`) y pantallazos/video de la demo.

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| `permission denied` al usar docker | Usuario fuera del grupo `docker` | `sudo usermod -aG docker $USER` y reconectar |
| `pull access denied` | Usuario o tag incorrecto | Revisar `DOCKERHUB_USER` e `IMAGE_TAG` |
| Página en blanco o 502 | Backend aún arrancando | Esperar 1 min y revisar `logs backend` |
| `Access denied for user` | Claves cambiadas con el volumen ya creado | `down -v` y volver a levantar |
| `port is already allocated` en 80 | Otro servicio usa el puerto | `sudo ss -tulpn \| grep :80` |
| `no space left on device` | Imágenes viejas | `docker system prune -af` |
| SSH `Connection timed out` | Cambió tu IP o la instancia está detenida | Revisar Security Group e iniciar la instancia |
