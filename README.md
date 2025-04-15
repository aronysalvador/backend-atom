# Backend Hexagonal con Express y Firebase

Backend desarrollado con arquitectura hexagonal usando Express y Firebase Firestore para la empresa Atom.

Desarrollador por: 
Arony Salvador Noguera
salvadorarony@gmail.com

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

4. Solicitar .env si desea levantar proyecto localmente al correo salvadorarony@gmail.com

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
- POST `/api/users/login` - Obtener toker sin tener usuario
- GET `/api/users/:id` - Obtener usuario por ID


### Tareas
- POST `/api/tasks` - Crear tarea
- GET `/api/tasks/user/:userId` - Obtener tareas por usuario
- PUT `/api/tasks/:id` - Actualizar tarea
- DELETE `/api/tasks/:id` - Eliminar tarea

## Estructura del Proyecto

```
src/
├── application/    # Casos de uso y lógica de negocio
├── domain/        # Entidades y reglas de negocio
└── infrastructure/ # Implementaciones concretas
```

## TEST

Se aplicaron test unitarios utilizando JEST, aplicado solamente a los controler
