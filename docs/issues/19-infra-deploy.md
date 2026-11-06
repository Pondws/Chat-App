# [Infra]: Deploy web + API + database

**Phase:** 7 — Release

## Tasks
- [ ] Web → Vercel (root `apps/web`, `NEXT_PUBLIC_API_URL`)
- [ ] API → a host that supports WebSockets (Render / Railway / Fly.io); `prisma migrate deploy` on release
- [ ] Managed Postgres (Neon / Supabase / Railway)
- [ ] Production env: JWT secrets, `WEB_ORIGIN`, cross-site cookie settings (`sameSite=none; secure`) or one shared parent domain
- [ ] Smoke test after deploy (`/health`, register → chat between two users)
- [ ] Document the deploy steps in the README

## Acceptance criteria
- A public URL where two people can sign up and chat in real time
