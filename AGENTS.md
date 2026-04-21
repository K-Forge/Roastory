# Roastory · Agent Context

> Operational context and strict rules for AI agents, LLMs, and automated tools interacting with this repository.

---

## Project Overview

**Roastory** is a web-based library-cafe management system developed by the **K-Forge** team as the final project for the "Nuevas Tecnologias de Desarrollo" (NTD) course at Fundacion Universitaria Konrad Lorenz. 

- **Phase:** Active Development (Taller 4) — Backend API implementation phase.
- **Language Scope:** All documentation, codebase (variables, classes, comments), commit messages, and agent instructions MUST be in **English**. (User-facing UI may remain in Spanish if required by the professor, but all internal work is English).

## Tech Stack

> **Note:** The core stack has been defined. Agents MUST verify configuration files (e.g., `package.json`, `pnpm-lock.yaml`, `angular.json`) before executing commands.

- **Frontend:** Angular
- **Backend:** Node.js with Express
- **Database:** MongoDB (Atlas)
- **Package Manager:** pnpm
- **Containers:** Docker (Expected for future deployment phases)

## Core Modules

| Module                 | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| **Product Catalog**    | Books, beverages, and food with advanced search and filters. |
| **Inventory**          | Stock control and automated reorder alerts.                  |
| **Point of Sale (POS)**| Sales recording, cart management, and totals calculation.    |
| **Customer Mgmt**      | Customer registry and purchase history tracking.             |
| **Reports**            | Sales by period and best-selling products analytics.         |
| **Auth & Users**       | JWT and Bcrypt based authentication and user management.     |
| **Billing**            | Logic for generating and downloading PDF invoices.           |

## Anticipated Repository Structure

```text
Roastory/
├── backend/                 # Node.js + Express REST API (To be initialized)
├── frontend/                # Angular application code (To be initialized)
├── database/                # MongoDB scripts and seed data (To be initialized)
├── DOCUMENTACION/           # Technical documentation, schedules, and summaries
│   ├── Cronograma Taller 4 Roastory.txt
│   └── RoastoryResumenEjecutivo_Entrega1.txt
├── assets/                  # Images, logos, and UI placeholders
│   ├── KForge-Yellow-Logo.png
│   └── project-banner.svg
├── CONTRIBUTING.md
├── CONTRIBUTORS.md
├── Contexto.md              # Project context, roles, and Taller 4 assignments
├── AGENTS.md                # AI Agents context and strict rules
├── CLAUDE.md                # Agent instruction pointer
├── LICENSE                  # Project license
└── README.md                # Main project documentation
```

## Conventions

- **Commits:** `type: message in english` (e.g., `feat: add product catalog search`, `fix: resolve inventory calculation bug`). Follow Conventional Commits strictly. Read CONTRIBUTING.md
- **Branches:** Git Flow (`main`, `develop`, `feature/*`, `chore/*`, `bugfix/*`, `hotfix/*`) and `NameSurname` format for current assignments.
- **Language Policy:** 
  - **Code, Variables, Comments:** English ONLY.
  - **Documentation (README, Contexto.md, etc.):** English ONLY.
  - **Commit Messages:** English ONLY.

## Versioning

Format: `MAJOR.MINOR.PATCH`.
- `MAJOR` for large refactors, architectural shifts, or production releases.
- `MINOR` for new backward-compatible features (e.g., adding the Reports module).
- `PATCH` for bug fixes.

## Database Guidelines (Anticipated)

- **Core Entities:** `User`, `Customer`, `Product` (inheritance for `Book`, `Beverage`, `Food`), `Inventory`, `Order`, `OrderDetail`.
- **Enums expected:** `Role` (ADMIN, CASHIER, INVENTORY_MANAGER), `OrderStatus` (PENDING, COMPLETED, CANCELLED).
- **Security:** Passwords must be hashed using bcrypt. No sensitive data stored in plain text. JWT used for session management.

## High-Priority Tasks (Current Phase - Taller 4)

1. Initialize project scaffolding (Angular Frontend, Express Backend, MongoDB Database) using **pnpm**.
2. Implement User Auth module (JWT/Bcrypt) and secure routes with middleware.
3. Implement Inventory (CRUD) and Sales (CRUD) modules.
4. Implement Billing module with PDF generation logic.
5. Setup Postman collections and populate the database with real test data.

## AI Agent Instructions

- **Branch Syncing & Respecting Teammates' Work:** NEVER overwrite or skip another teammate's work. Before starting new features or making a push, ALWAYS branch off the latest teammate's branch or pull their changes if working on a shared branch, so their progress is preserved and accumulated.
- **Strict Task Boundaries:** NEVER write code, templates, or even commented-out stubs for tasks assigned to other team members. Let them figure out their own implementations and setup.
- **Do NOT modify:** `.env` files (contains secrets). Always use `.env.example` for templates.
- **Do NOT assume:** Do not assume standard test commands or build tools. Always read the directory configuration files first.
- **Communication:** Never use emojis in technical documents (e.g., `.md` files). Keep structures professional and formal.
- **Scope Limitation:** Limit changes strictly to the requested scope. Do not refactor unrelated code unless explicitly asked by the user.
- **Knowledge Sync:** Always read `README.md`, `Contexto.md` and `CONTRIBUTING.md` to understand current progress and formatting rules before suggesting changes.
