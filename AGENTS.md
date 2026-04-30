# Roastory · Agent Context

> Operational context and rules for AI agents working in this repository.

---

## K-Forge Ecosystem

K-Forge is a software development club at Fundación Universitaria Konrad Lorenz (FUKL), Bogotá, founded by Brian Vargas (@13rianVargas). The club builds real-world software products for the university and community.

| Project | Repo | Description |
|---------|------|-------------|
| K-Forge Website | `K-Forge/` | Public landing page (Angular, Vercel) |
| KApp | `KApp/` | University management platform (Spring Boot microservices) |
| TiendaQ | `TiendaQ/` | University e-commerce system (Spring Boot + Angular) |
| **Roastory** | `Roastory/` | Library-cafe management system — you are here |

---

## Project Overview

**Roastory** is a web-based library-cafe management system developed by the K-Forge team as the final project for the "Nuevas Tecnologías de Desarrollo" (NTD) course at FUKL. It handles inventory, point of sale, customer management, billing (PDF invoices), and user authentication.

The name combines "Roast" (coffee roasting) and "Story" (books), reflecting the library-cafe concept.

**Project board:** https://github.com/orgs/K-Forge/projects/16

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend runtime | Node.js + Express 5 |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Database | MongoDB Atlas (`mongoose` 9.5) |
| PDF generation | pdfkit |
| Package manager | pnpm |
| Dev server | nodemon |
| Frontend | Angular (not yet implemented) |
| Containers | Docker (planned for deployment) |

---

## Repository Structure

```text
Roastory/
├── backend/
│   ├── src/
│   │   ├── config/          # DB connection, environment config
│   │   ├── controllers/     # Route handlers
│   │   ├── middlewares/     # Auth middleware (JWT verification)
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express router definitions
│   │   └── seed/
│   │       ├── seed.js      # Populate DB with test data
│   │       └── dropDB.js    # Drop all collections
│   ├── server.js            # Entry point
│   ├── package.json
│   └── .env.example         # Environment variable template
├── frontend/                # Not yet implemented
├── postman/                 # API collection
├── DOCS/                    # Course documentation
│   ├── Cronograma Taller 4 Roastory.txt
│   └── RoastoryResumenEjecutivo_Entrega1.txt
├── assets/
├── Contexto.md              # Project context, team roles, assignments
├── CONTRIBUTING.md
├── CONTRIBUTORS.md
└── README.md
```

---

## Dev Commands

```bash
# Install dependencies
cd backend && pnpm install

# Dev server (nodemon auto-reload)
pnpm dev                     # → port 3000

# Production start
pnpm start

# Seed database with test data
pnpm seed

# Drop all collections
pnpm drop
```

Required env vars (copy from `.env.example`):
```
PORT=3000
MONGODB_URI=<Atlas connection string>
JWT_SECRET=<secret>
```

---

## Core Modules

| Module | Description |
|--------|-------------|
| User / Auth | Registration, login (JWT + bcrypt), route protection middleware |
| Inventory | CRUD for products (books, beverages, food) and stock control |
| Sales | Sales recording, cart, order management |
| Billing | PDF invoice generation and download |
| Customers | Customer registry and purchase history |
| Reports | Sales analytics by period and best-selling products |

---

## Conventions

### Code (English only)

- All code, variables, comments, commit messages, and documentation must be in English.
- User-facing UI strings may remain in Spanish if required by the professor.
- REST controllers in `src/controllers/`. Routes in `src/routes/`. Mongoose schemas in `src/models/`.

### Security

- Passwords hashed with bcrypt. No plain-text secrets in code.
- JWT used for session management. Protected routes use the auth middleware.
- Never commit `.env` — use `.env.example` as the template.
- Never hardcode credentials.

### Git

- **Commits:** Conventional Commits, English, lowercase, no scope, no final period.
  ```
  feat: add user authentication module
  fix: resolve pdf generation memory leak
  chore: update mongoose to 9.5
  ```
- **Branches:** Git Flow — `main`, `develop`, `feature/*`, `bugfix/*`, `hotfix/*`.
- Teammate work discipline: branch off teammates' latest work. Never overwrite or skip another member's progress.

### Versioning

SemVer `MAJOR.MINOR.PATCH`. Release cycle: alpha → beta → stable.

---

## Team Roles (Taller 4 Assignment)

| Member | Role | Responsibilities |
|--------|------|-----------------|
| Brian Vargas | Backend Dev | Server setup, Auth module (JWT/bcrypt), middleware, code review, merges |
| Sebastián Angulo | DBA | MongoDB Atlas setup, schemas, Inventory module, Billing module, seed data |
| Lina Bello | Frontend Dev | Sales module, Postman collection, documentation, README |

---

## Current State

- Backend scaffolded with Express 5 + pnpm.
- Auth module implemented: user registration and login with JWT + bcrypt.
- Middleware for protected routes implemented.
- Backend structure: `config/`, `controllers/`, `middlewares/`, `models/`, `routes/`, `seed/`.
- Inventory, Billing, Sales modules: in progress (see team assignments).
- Frontend: not yet started.
- Postman collection: in progress.
- Docker: not yet configured.

---

## AI Agent Instructions

- **Language:** All code, variables, comments, and documentation in English. No exceptions.
- **Strict task scope:** Never write code, templates, or stubs for tasks assigned to other team members.
- **Teammate branches:** Always branch off the latest teammate work. Never overwrite their progress.
- **Never commit** `.env`. Use `.env.example` for templates.
- **No automatic commits.** Present implementation plan and code for review before any `git commit`.
- **Do not assume** build tools or test commands. Read `package.json` first.
- **No emojis** in technical markdown documents.
- **Scope discipline:** Limit changes strictly to the requested scope. Do not refactor unrelated code.
- **Before changes:** Read `README.md`, `Contexto.md`, and `CONTRIBUTING.md` first.
