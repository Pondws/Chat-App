# Chat App Roadmap — start to finish

**Current state:** Express + Prisma API with register/login/`GET /me`, and a Next.js web app with a login UI and a chat UI that uses mock data. **Goal:** a deployed, real-time 1:1 chat app.

Each item below is written up as a ready-to-file GitHub issue in [`docs/issues/`](./issues). They've been filed on GitHub as #5–#24, tracked by epic #4. (`scripts/create-issues.sh` can recreate them in another repo.)

| Issue | Phase | Issue |
|---|-------|-------|
| #5 | 0 Foundation | [Infra] Local dev setup (Postgres via Docker, env files, root scripts) |
| #6 | 1 Backend core | [Backend] Fix auth middleware & add refresh-token / logout endpoints |
| #7 | 1 Backend core | [Backend] CORS, global error handler, validation middleware |
| #8 | 1 Backend core | [Backend] Prisma schema for conversations & messages |
| #9 | 1 Backend core | [Backend] Users API — search & update profile |
| #10 | 1 Backend core | [Backend] Conversations API |
| #11 | 1 Backend core | [Backend] Messages API (paginated history + send) |
| #12 | 2 Real-time | [Backend] Real-time messaging with Socket.IO |
| #13 | 2 Real-time | [Backend] Typing, presence & read receipts |
| — | 3 Frontend | **#1** [Frontend] Connect Login API *(already exists)* |
| #14 | 3 Frontend | [Frontend] Register page |
| #15 | 3 Frontend | [Frontend] Auth state, protected routes, token refresh & logout |
| #16 | 3 Frontend | [Frontend] Chat list from API + start a new chat |
| #17 | 3 Frontend | [Frontend] Chat window — history & sending |
| #18 | 4 Real-time FE | [Frontend] Socket.IO client — live messages, typing, presence, seen |
| #19 | 5 Polish | [Frontend] Profile / settings page |
| #20 | 5 Polish | [Frontend] Responsive layout & UX polish |
| #21 | 6 Quality | [Testing] API & frontend tests |
| #22 | 6 Quality | [Infra] CI with GitHub Actions |
| #23 | 7 Release | [Infra] Deploy web + API + database |
| #24 | 8 Stretch | [Feature] Stretch goals (groups, attachments, reactions…) |

Suggested order: #5 → #6 #7 → #8 → #9 #10 #11 (alongside #1 #14 #15) → #16 #17 → #12 #13 → #18 → #19 #20 → #21 #22 → #23.
