# [Backend]: CORS, global error handler, validation middleware, consistent responses

**Phase:** 1 — Backend core

## Tasks
- [ ] Enable `cors` for `WEB_ORIGIN` with `credentials: true`
- [ ] Add a central error-handling middleware and an `AppError(status, message)` class, so controllers stop needing their own try/catch
- [ ] Add a `validate(schema)` middleware that uses the existing zod schemas and returns `422` with field errors
- [ ] Use a consistent response shape, e.g. `{ data }` / `{ message, errors? }`
- [ ] Add `helmet` and rate-limiting on `/auth/*`
- [ ] Add a `GET /health` endpoint

## Acceptance criteria
- A Zod error returns 422 with field details, and an unknown error returns 500 without leaking a stack trace
