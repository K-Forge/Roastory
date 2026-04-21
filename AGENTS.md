# Roastory · Agent Context

> Operational context and strict rules for AI agents, LLMs, and automated tools interacting with this repository.

---

## Project Overview

**Roastory** is a web-based library-cafe management system developed by the **K-Forge** team as the final project for the "Nuevas Tecnologias de Desarrollo" (NTD) course at Fundacion Universitaria Konrad Lorenz. 

- **Phase:** Early development — stack and architecture are currently under definition with the professor.
- **Primary Audience (UI/Docs):** Spanish (Users and Professor).
- **Secondary Audience (Code/Agents):** English (Commits, Agent Instructions, Code Variables).

## Tech Stack

> **Note:** The exact stack is currently under definition. Agents MUST verify configuration files (e.g., `package.json`, `pom.xml`) before assuming a specific framework.

- **Frontend:** TBD (e.g., React, Angular, or Vue)
- **Backend:** TBD (e.g., Node.js, Spring Boot, or Django)
- **Database:** TBD (e.g., PostgreSQL, MySQL, or MongoDB)
- **Package Manager:** TBD
- **Containers:** TBD (Docker expected)

## Core Modules

| Module                 | Description                                                  |
| ---------------------- | ------------------------------------------------------------ |
| **Product Catalog**    | Books, beverages, and food with advanced search and filters. |
| **Inventory**          | Stock control and automated reorder alerts.                  |
| **Point of Sale (POS)**| Sales recording, cart management, and totals calculation.    |
| **Customer Mgmt**      | Customer registry and purchase history tracking.             |
| **Reports**            | Sales by period and best-selling products analytics.         |

## Anticipated Repository Structure

```text
Roastory/
├── backend/                 # Backend application code (TBD)
├── frontend/                # Frontend application code (TBD)
├── database/                # SQL/NoSQL scripts and seed data (TBD)
├── docs/                    # Technical documentation and diagrams
│   ├── REQUIREMENTS.md      # Functional requirements
│   └── DESIGN.md            # Architecture decisions
├── assets/                  # Images, logos, and UI placeholders
│   ├── KForge-Yellow-Logo.png
│   └── project-banner.svg
├── CONTRIBUTING.md
├── CONTRIBUTORS.md
└── README.md
```

## Conventions

- **Commits:** `type: message in english` (e.g., `feat: add product catalog search`, `fix: resolve inventory calculation bug`). Follow Conventional Commits strictly.
- **Branches:** Git Flow (`main`, `develop`, `feature/*`, `chore/*`, `bugfix/*`, `hotfix/*`).
- **Language Policy:** 
  - User-facing UI, documentation (README, CONTRIBUTING), and user-directed comments MUST be in **Spanish**.
  - Code (variables, functions, classes, models), commit messages, and internal agent instructions MUST be in **English**.

## Versioning

Format: `MAJOR.MINOR.PATCH`.
- `MAJOR` for large refactors, architectural shifts, or production releases.
- `MINOR` for new backward-compatible features (e.g., adding the Reports module).
- `PATCH` for bug fixes.

## Database Guidelines (Anticipated)

- **Core Entities:** `User`, `Customer`, `Product` (inheritance for `Book`, `Beverage`, `Food`), `Inventory`, `Order`, `OrderDetail`.
- **Enums expected:** `Role` (ADMIN, CASHIER, INVENTORY_MANAGER), `OrderStatus` (PENDING, COMPLETED, CANCELLED).
- **Security:** Passwords must be hashed. No sensitive data stored in plain text.

## High-Priority Tasks (Current Phase)

1. Finalize and document the Tech Stack with the course professor.
2. Initialize project scaffolding (Frontend, Backend, Database) based on the approved stack.
3. Design and document the initial Database Schema.
4. Setup environment variables templates (`.env.example`).
5. Create initial UI wireframes for the POS and Catalog modules.

## AI Agent Instructions

- **Do NOT modify:** `.env` files (contains secrets). Always use `.env.example` for templates.
- **Do NOT assume:** Do not assume standard test commands or build tools. Always read the directory configuration files first.
- **Communication:** Never use emojis in technical documents (e.g., `.md` files). Keep structures professional and formal.
- **Scope Limitation:** Limit changes strictly to the requested scope. Do not refactor unrelated code unless explicitly asked by the user.
- **Knowledge Sync:** Always read `README.md` and `CONTRIBUTING.md` to understand current progress and formatting rules before suggesting changes.
