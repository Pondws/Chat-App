# [Backend]: Messages API (paginated history + send)

**Phase:** 1 — Backend core
**Depends on:** conversations API

## Endpoints
- [ ] `GET /conversations/:id/messages?cursor=<messageId>&limit=30`: cursor pagination, newest first, returning `{ data, nextCursor }`
- [ ] `POST /conversations/:id/messages` `{ text }`: validate (non-empty after trimming, max 2000 chars), create the message, and bump `conversation.updatedAt` in the same transaction
- [ ] Response shape matches `mockMessages` in the web app (`id, text, createdAt, sender { id, name }`)

## Acceptance criteria
- Scrolling back through 100+ messages works without duplicates or gaps
