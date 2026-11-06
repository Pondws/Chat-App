# [Frontend]: Auth state, protected routes, token refresh & logout

**Phase:** 3 — Frontend integration
**Depends on:** #1, backend auth-hardening issue

## Tasks
- [ ] Shared `axios` instance with `baseURL = NEXT_PUBLIC_API_URL` and `withCredentials`
- [ ] Keep the access token in memory or a React context; a request interceptor adds `Authorization: Bearer`
- [ ] A response interceptor catches a `401`, calls `/auth/refresh` once, and retries queued requests; if that fails, redirect to `/login`
- [ ] `useMe()` query; guard `/` (chat) so logged-out users go to `/login`, and logged-in users visiting `/login` go to `/`
- [ ] Wire the existing "Log out" dropdown item to `/auth/logout`, clearing the query cache

## Acceptance criteria
- Reloading the page keeps you logged in, and logging out blocks access to the chat
