# Task System

A full-stack task management system built for development teams to organize work, manage subtasks, track progress, and estimate workload.

---

## Tech Stack

**Frontend**

- Next.js · React · TypeScript · TailwindCSS · Axios

**Backend**

- NestJS · TypeScript · TypeORM · PostgreSQL · Jest

**Infrastructure**

- Docker · Docker Compose

---

## Features

### Task Management

- Create, update, delete, and view tasks
- Task detail management
- Task lifecycle: `TODO` → `IN_PROGRESS` → `DONE`

### Priority System

- `LOW` · `MEDIUM` · `HIGH`

### Recursive Subtasks

Tasks support nested subtasks with unlimited depth.

### Estimations

Each task can contain an optional `estimate` value. The system calculates:

- Total estimated effort
- `TODO` estimated effort
- `IN_PROGRESS` estimated effort

All metrics include nested subtasks recursively.

---

## Project Structure

```
.
├── back-task-tools/
│   ├── dist/
│   ├── node_modules/
│   ├── src/
│   │   ├── tasks/
│   │   └── main.ts
│   ├── .dockerignore
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── nest-cli.json
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.build.json
│   └── tsconfig.json
│
├── front-task-tools/
│   ├── .next/
│   ├── app/
│   ├── components/
│   ├── node_modules/
│   ├── services/
│   ├── types/
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
│
├── .dockerignore
├── .env
├── docker-compose.yml
├── IA_USAGE.md
└── README.md
```

---

## Requirements

- [Docker](https://www.docker.com/)
- Docker Compose

No external services or cloud dependencies required.

---

## Environment Variables

Create the file `back-task-tools/.env` with the following content:

```env
PORT=3001

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=tasks_db
```

---

## Run the Project

From the project root:

```bash
docker compose up --build
```

| Service     | URL                         |
| ----------- | --------------------------- |
| Frontend    | http://localhost:3000       |
| Backend API | http://localhost:3001/tasks |

---

## Run Tests

Open a separate terminal:

```bash
cd back-task-tools
npm install
npm test
```

---

## API Reference

### Endpoints

| Method   | Endpoint              | Description                  |
| -------- | --------------------- | ---------------------------- |
| `POST`   | `/tasks`              | Create a task                |
| `GET`    | `/tasks`              | Get all tasks                |
| `GET`    | `/tasks/:id`          | Get task by ID               |
| `PATCH`  | `/tasks/:id`          | Update a task                |
| `DELETE` | `/tasks/:id`          | Delete a task                |
| `POST`   | `/tasks/:id/subtasks` | Create a subtask             |
| `GET`    | `/tasks/:id/tree`     | Get full recursive task tree |
| `GET`    | `/tasks/:id/metrics`  | Get recursive effort metrics |

### Example Payload

```json
{
  "title": "Implement authentication",
  "description": "Create JWT authentication flow",
  "status": "TODO",
  "priority": "HIGH",
  "estimate": 8
}
```

### Metrics Response

```json
{
  "taskId": 1,
  "title": "Implement authentication",
  "total": 18,
  "todo": 13,
  "inProgress": 5
}
```

---

## Design Decisions

- **Recursive subtasks** are implemented using self-referencing relations in PostgreSQL.
- **Recursive metrics** are calculated server-side to centralize business logic.
- **Docker Compose** simplifies local setup with a single command.
- **Input validation** is handled with `class-validator`.
- **Frontend** renders recursive task trees dynamically.

---

## Future Improvements

- Authentication and authorization
- Drag and drop board
- Search and filtering
- Pagination
- Due dates
- Labels and tags
- WebSocket real-time updates

---

## Author

Developed as a technical challenge project using AI-assisted development workflows.
