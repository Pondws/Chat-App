# API

Express 5 + Prisma (PostgreSQL) + JWT auth.

## Setup

```bash
cp .env.example .env        # fill in DATABASE_URL and JWT secrets
yarn install                # from repo root
yarn workspace api prisma:generate
yarn workspace api prisma:migrate
yarn workspace api dev
```

## Auth endpoints

| Method | Path               | Body                          | Response |
| ------ | ------------------ | ----------------------------- | -------- |
| POST   | `/auth/register`   | `{ email, password, name }`   | `201 { message, user }` |
| POST   | `/auth/login`      | `{ email, password }`         | `200 { accessToken, refreshToken, user }` |
| POST   | `/auth/refresh`    | `{ refreshToken }`            | `200 { accessToken, refreshToken }` |
| POST   | `/auth/logout`     | `{ refreshToken }`            | `204` |
| POST   | `/auth/logout-all` | — (Bearer access token)       | `204` |
| GET    | `/me`              | — (Bearer access token)       | `200 { id, email, name }` |

- Access token: 15 minutes, send as `Authorization: Bearer <token>`.
- Refresh token: 7 days, **rotated on every `/auth/refresh`** — always store the new one.
  Only a sha256 hash is stored in the DB. Reusing an already-rotated refresh token
  revokes all of that user's sessions.
- Errors are `{ message }`; validation errors (400) also include `errors: [{ path, message }]`.
  Status codes: 400 invalid input, 401 bad credentials/token, 409 email taken.
