# Chat App Roadmap — start to finish

**Current state:** Express + Prisma API with register/login/`GET /me`, and a Next.js web app with a login UI and a chat UI that uses mock data. **Goal:** a deployed, real-time 1:1 chat app.

Each item below is written up as a ready-to-file GitHub issue in [`docs/issues/`](./issues). Run `scripts/create-issues.sh` to create them all, plus an epic tracking issue.

| # | Phase | Issue |
|---|-------|-------|
| 01 | 0 Foundation | [Infra] Local dev setup (Postgres via Docker, env files, root scripts) |
| 02 | 1 Backend core | [Backend] Fix auth middleware & add refresh-token / logout endpoints |
| 03 | 1 Backend core | [Backend] CORS, global error handler, validation middleware |
| 04 | 1 Backend core | [Backend] Prisma schema for conversations & messages |
| 05 | 1 Backend core | [Backend] Users API — search & update profile |
| 06 | 1 Backend core | [Backend] Conversations API |
| 07 | 1 Backend core | [Backend] Messages API (paginated history + send) |
| 08 | 2 Real-time | [Backend] Real-time messaging with Socket.IO |
| 09 | 2 Real-time | [Backend] Typing, presence & read receipts |
| — | 3 Frontend | **#1** [Frontend] Connect Login API *(already exists)* |
| 10 | 3 Frontend | [Frontend] Register page |
| 11 | 3 Frontend | [Frontend] Auth state, protected routes, token refresh & logout |
| 12 | 3 Frontend | [Frontend] Chat list from API + start a new chat |
| 13 | 3 Frontend | [Frontend] Chat window — history & sending |
| 14 | 4 Real-time FE | [Frontend] Socket.IO client — live messages, typing, presence, seen |
| 15 | 5 Polish | [Frontend] Profile / settings page |
| 16 | 5 Polish | [Frontend] Responsive layout & UX polish |
| 17 | 6 Quality | [Testing] API & frontend tests |
| 18 | 6 Quality | [Infra] CI with GitHub Actions |
| 19 | 7 Release | [Infra] Deploy web + API + database |
| 20 | 8 Stretch | [Feature] Stretch goals (groups, attachments, reactions…) |

Suggested order: 01 → 02–03 → 04 → 05–07 (alongside #1, 10, 11) → 12–13 → 08–09 → 14 → 15–16 → 17–18 → 19.
