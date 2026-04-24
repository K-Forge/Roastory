# Backend Authorization Matrix

## Purpose

This document defines authentication and authorization rules for Roastory backend endpoints.

## Authentication Flow

1. `POST /api/auth/register` creates a CUSTOMER user.
2. `POST /api/auth/login` returns a JWT token.
3. Protected routes require `Authorization: Bearer <token>`.
4. Role-restricted routes require both valid token and allowed role.

## Endpoint Access Matrix

| Endpoint | Method | Authentication | Roles Allowed |
| --- | --- | --- | --- |
| `/api/auth/register` | POST | Public | Any |
| `/api/auth/login` | POST | Public | Any |
| `/api/auth/me` | GET | Required | Any authenticated user |
| `/api/auth/admin` | GET | Required | ADMIN |
| `/api/users` | GET | Required | ADMIN |
| `/api/users/:id` | GET | Required | ADMIN |
| `/api/users/:id/role` | PATCH | Required | ADMIN |
| `/api/users/:id/deactivate` | PATCH | Required | ADMIN |
| `/api/products` | GET | Public | Any |
| `/api/products/:id` | GET | Public | Any |
| `/api/products` | POST | Required | ADMIN, INVENTORY_MANAGER |
| `/api/products/:id` | PUT | Required | ADMIN, INVENTORY_MANAGER |
| `/api/products/:id/stock` | PATCH | Required | ADMIN, INVENTORY_MANAGER |
| `/api/products/:id` | DELETE | Required | ADMIN, INVENTORY_MANAGER |
| `/api/orders` | POST | Required | Any authenticated user |
| `/api/orders` | GET | Required | Any authenticated user |
| `/api/orders/:id` | GET | Required | Any authenticated user |
| `/api/orders/:id` | PUT | Required | ADMIN, CASHIER |
| `/api/orders/:id` | DELETE | Required | ADMIN |

## Required Environment Variables

- `JWT_SECRET`: mandatory secret used to sign and verify tokens.
- `MONGO_URI`: MongoDB connection string.

## Notes

- Public registration ignores incoming role to prevent privilege escalation.
- User administration is restricted to ADMIN role only.
- Product write operations are restricted to ADMIN and INVENTORY_MANAGER.
