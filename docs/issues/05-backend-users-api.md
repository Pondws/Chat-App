# [Backend]: Users API — search & update profile

**Phase:** 1 — Backend core

## Endpoints (all authenticated)
- [ ] `GET /users?search=<q>`: search by name or email (case-insensitive), excluding the current user, max 20 results
- [ ] `PATCH /me`: update `name` and `avatarUrl` (zod-validated)
- [ ] `GET /me` returns `id, email, name, avatarUrl` (no password)

## Acceptance criteria
- Searching "jo" returns matching users, never includes the caller, and never includes password hashes
