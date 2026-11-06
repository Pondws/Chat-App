# [Infra]: Local dev setup (Postgres via Docker, env files, root scripts)

**Phase:** 0 — Foundation

## Why
Today the API needs a hand-configured Postgres and undocumented env vars (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `PORT`). The root `package.json` only runs the `web` workspace.

## Tasks
- [ ] Add `docker-compose.yml` at the repo root with a `postgres:16` service and a named volume
- [ ] Add `apps/api/.env.example` and `apps/web/.env.example` (`NEXT_PUBLIC_API_URL`)
- [ ] Root scripts: `dev:api`, `dev:web`, `dev` (both together, e.g. with `concurrently`), `db:migrate`, `db:generate`
- [ ] Add a `build`/`start` script to `apps/api` (`tsc` → `node dist/server.js`)
- [ ] Rewrite the root `README.md` (it's currently UTF-16 encoded) with setup steps

## Acceptance criteria
- A fresh clone runs with `docker compose up -d && yarn && yarn db:migrate && yarn dev`
