# [Frontend]: Register page

**Phase:** 3 — Frontend integration
**Related:** #1 (Connect Login API)

## Tasks
- [ ] Add `/register`, reusing the login page layout (react-hook-form + zod, same rules as `auth.validation.ts`)
- [ ] Fields: name, email, password, confirm password
- [ ] Call `POST /auth/register` through a TanStack Query mutation; show API errors (e.g. "the user already exists" — the API returns this message in Thai)
- [ ] On success, redirect to `/login` with a success toast
- [ ] Link between the login and register pages

## Acceptance criteria
- Validation errors show inline, and a successful registration lets you log in right away
