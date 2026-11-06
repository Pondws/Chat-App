# [Backend]: Conversations API

**Phase:** 1 — Backend core
**Depends on:** schema issue

## Endpoints (authenticated; the user must be a participant)
- [ ] `GET /conversations`: the caller's conversations sorted by `updatedAt desc`, each with the other participant(s), the last message, and `unreadCount` (messages after `lastReadAt` that weren't sent by the caller). This matches the shape of `mockChatList` in `apps/web/app/page.tsx`
- [ ] `POST /conversations` `{ userId }`: find or create the 1:1 conversation between the caller and `userId` (idempotent)
- [ ] `GET /conversations/:id`: details, or `403` if the caller isn't a participant
- [ ] `POST /conversations/:id/read`: set `lastReadAt = now()`

## Acceptance criteria
- Calling `POST /conversations` twice with the same user returns the same conversation
- A user can never read a conversation they aren't part of
