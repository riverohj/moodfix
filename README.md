# MoodFix

MoodFix es un recomendador de peliculas para reducir fatiga de decision. TMDb actua como fuente de datos y Mood Radar como logica propia del sistema.

Este repositorio arranca con un boilerplate full stack sencillo:

- `frontend/`: app React con Vite
- `backend/`: API Flask
- `docs/`: cuaderno de ruta, decisiones y seguimiento

## Objetivo de esta base

La base ya no es solo boilerplate. A dia de hoy incluye catalogo local validado, backend comun para el equipo y la integracion en curso del onboarding estable con auth y perfil.

## Estructura

```text
.
├── backend/
├── docs/
├── frontend/
└── README.md
```

## Arranque local

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

Por defecto el backend arranca en modo estable, sin `debug` ni `reloader`.
Si alguien necesita debug local en su propia maquina, puede activar `FLASK_DEBUG=1`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Si necesitas apuntar el frontend a otro backend, usa `VITE_API_BASE_URL`.
Por defecto la app trabaja contra:

```bash
VITE_API_BASE_URL=http://localhost:5001/api
```

## Convenciones de trabajo

- Ramas cortas por tarea: `feat/...`, `fix/...`, `docs/...`, `chore/...`
- Commits con `Conventional Commits`
- Decisiones importantes en `docs/decisions.md`
- Progreso y bloqueos en `docs/progress-log.md`

## URL inicial de la API

La URL base inicial del backend es:

`http://localhost:5001/api`

Endpoint de comprobacion:

`http://localhost:5001/api/health`

Endpoint de comprobacion de base de datos:

`http://localhost:5001/api/db/status`

Endpoint minimo de consulta de catalogo:

`http://localhost:5001/api/movies?page=1&limit=20`

## Siguientes pasos

1. Mergear EPIC 2 backend auth y perfil en `main`.
2. Validar la integracion real del onboarding frontend contra la API.
3. Cerrar EPIC 2 con flujo completo de registro o login, onboarding y re-edicion.
4. Pasar despues a EPIC 3 para preguntas de sesion y handoff guest -> autenticado.
