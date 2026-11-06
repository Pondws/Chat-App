# [Backend]: Typing indicators, online presence & read receipts

**Phase:** 2 — Real-time
**Depends on:** Socket.IO issue

## Tasks
- [ ] Presence: track socket count per user in memory; emit `presence:update { userId, online }` to that user's contacts when the count changes between 0 and 1; save `lastSeenAt` on disconnect
- [ ] Typing: `typing:start` / `typing:stop { conversationId }` → forward to the other participants (server-side timeout of about 5s)
- [ ] Read receipts: `conversation:read { conversationId }` → update `lastReadAt` and emit `conversation:read { conversationId, userId, readAt }` to the other participants
- [ ] Message status (`sent | delivered | seen`), worked out from the recipient's `lastReadAt` and online status

## Acceptance criteria
- The other user sees "typing…", an online dot, and a "seen" tick update live
