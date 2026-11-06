# [Infra]: CI with GitHub Actions

**Phase:** 6 — Quality

## Tasks
- [ ] `.github/workflows/ci.yml` on PRs and pushes to `main`
- [ ] Jobs: install (yarn cache) → lint → typecheck (`tsc --noEmit` for both apps) → `prisma validate` → test (Postgres service container) → `next build`
- [ ] Branch protection on `main` requiring CI to pass

## Acceptance criteria
- A PR with a type error or failing test can't be merged
