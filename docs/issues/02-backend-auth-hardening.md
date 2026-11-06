# [Backend]: Fix auth middleware & add refresh-token / logout endpoints

**Phase:** 1 — Backend core

## Why
- `middleware/auth.ts` only logs an invalid/expired token in its `catch` and never responds, so the request hangs.
- `login` returns a `refreshToken`, but there's no endpoint that uses it (the access token expires after 15m).
- `register` logs the whole user object, including the password hash.

## Tasks
- [ ] Respond with `401` on an invalid or expired token; reject a malformed `Authorization` header (anything but `Bearer <token>`)
- [ ] `POST /auth/refresh`: verify the refresh token and issue a new access token (optionally rotate the refresh token)
- [ ] Store the refresh token in an `httpOnly`, `secure`, `sameSite` cookie instead of the response body
- [ ] `POST /auth/logout` clears the cookie (optionally keeps a token-version / denylist)
- [ ] Remove `console.log('user', user)` from the register controller
- [ ] Never return `password` from any user query (Prisma `omit`/`select`)

## Acceptance criteria
- An expired access token gets `401` right away, and the client can refresh silently
