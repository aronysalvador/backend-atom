# Backend Hexagonal con Express y Firebase

Backend desarrollado con arquitectura hexagonal usando Express y Firebase Firestore.

## Características

- Arquitectura hexagonal (ports & adapters)
- Express como framework web
- Firebase Firestore como base de datos
- TypeScript para tipado estático
- Manejo de usuarios y tareas

## Requisitos

- Node.js 18.x
- npm
- Cuenta de Firebase
- Archivo de credenciales de Firebase (serviceAccountKey.json)

## Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd backend-hexagonal-express
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar Firebase:
- Crear un proyecto en Firebase Console
- Generar el archivo serviceAccountKey.json
- Colocar el archivo en la raíz del proyecto

## Desarrollo

Para desarrollo local:
```bash
npm run dev
```

Para producción:
```bash
npm run build
npm start
```

## Endpoints

### Usuarios
- POST `/api/users` - Crear usuario
- GET `/api/users` - Obtener todos los usuarios
- GET `/api/users/:id` - Obtener usuario por ID
- PUT `/api/users/:id` - Actualizar usuario
- DELETE `/api/users/:id` - Eliminar usuario

### Tareas
- POST `/api/tasks` - Crear tarea
- GET `/api/tasks/user/:userId` - Obtener tareas por usuario
- PUT `/api/tasks/:id` - Actualizar tarea
- DELETE `/api/tasks/:id` - Eliminar tarea
- PATCH `/api/tasks/:id/status` - Actualizar estado de tarea

## Estructura del Proyecto

```
src/
├── application/    # Casos de uso y lógica de negocio
├── domain/        # Entidades y reglas de negocio
└── infrastructure/ # Implementaciones concretas
```

## Licencia

MIT 