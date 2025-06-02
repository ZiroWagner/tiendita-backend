# Tiendita Backend API

Backend API para una aplicación POS (Point of Sale) de tienda de abarrotes desarrollada con NestJS, Prisma y PostgreSQL.

## Características

- Autenticación y autorización con JWT
- Gestión de usuarios y perfiles
- Gestión de productos y categorías
- Procesamiento de ventas
- Historial de transacciones
- Documentación API con Swagger

## Requisitos previos

- Node.js (v14 o superior)
- PostgreSQL
- npm o yarn

## Configuración

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd tiendita-backend
```

2. Instala las dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/tiendita?schema=public"
JWT_SECRET="tu-clave-secreta-para-jwt"
JWT_EXPIRATION="1d"
```

4. Genera el cliente Prisma:

```bash
npx prisma generate
```

5. Ejecuta las migraciones de la base de datos:

```bash
npx prisma migrate dev
```

## Ejecución

### Desarrollo

```bash
npm run start:dev
```

### Producción

```bash
npm run build
npm run start:prod
```

## Documentación API

Una vez que la aplicación esté en ejecución, puedes acceder a la documentación Swagger en:

```
http://localhost:3000/api
```

## Estructura del proyecto

```
src/
├── auth/               # Autenticación y autorización
├── categories/         # Gestión de categorías
├── products/           # Gestión de productos
├── sales/              # Procesamiento de ventas
├── users/              # Gestión de usuarios
├── prisma/             # Servicio de conexión a la base de datos
├── app.module.ts       # Módulo principal
└── main.ts             # Punto de entrada
```

## Integración con Supabase

Este proyecto utiliza Prisma como ORM, lo que facilita la migración a Supabase. Para conectar con Supabase:

1. Crea un proyecto en Supabase
2. Obtén la URL de conexión PostgreSQL
3. Actualiza la variable `DATABASE_URL` en el archivo `.env`
4. Ejecuta `npx prisma db push` para sincronizar el esquema

## Licencia

[MIT](LICENSE)
