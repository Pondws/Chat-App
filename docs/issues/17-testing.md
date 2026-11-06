# [Testing]: API & frontend tests

**Phase:** 6 — Quality

## Tasks
- [ ] API: `vitest` + `supertest` against a test Postgres (docker or testcontainers)
  - auth: register, login, refresh, invalid token → 401
  - conversations: find-or-create is idempotent, non-participants get 403
  - messages: pagination, validation
  - socket: authorized connection, `message:new` delivered to the recipient
- [ ] Web: `vitest` + Testing Library for the login/register forms and the message list
- [ ] Optional: a Playwright e2e test with two users exchanging a message

## Acceptance criteria
- `yarn test` passes locally and in CI
