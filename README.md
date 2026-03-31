# MoodFix

MoodFix es un recomendador de peliculas para reducir fatiga de decision. TMDb actua como fuente de datos y Mood Radar como logica propia del sistema.

Este repositorio arranca con un boilerplate full stack sencillo:

- `frontend/`: app React con Vite
- `backend/`: API Flask
- `docs/`: cuaderno de ruta, decisiones y seguimiento

## Objetivo de esta base

Esta primera version no implementa todavia el producto. Solo deja preparado el entorno tecnico y organizativo para que un equipo de 4 personas pueda trabajar en paralelo con orden y rapidez.

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

### Frontend

```bash
cd frontend
npm install
npm run dev
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

## Siguientes pasos

1. Crear el repositorio remoto en GitHub.
2. Invitar al resto del equipo.
3. Instalar dependencias y comprobar que frontend y backend arrancan.
4. Cerrar la taxonomia inicial del MVP antes de tocar la logica de producto.
