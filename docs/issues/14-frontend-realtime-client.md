# [Frontend]: Socket.IO client — live messages, typing, presence, seen

**Phase:** 4 — Real-time frontend
**Depends on:** backend real-time issues, chat window issue

## Tasks
- [ ] `SocketProvider`: connect with the access token after login, reconnect after a token refresh, disconnect on logout
- [ ] Send messages through `message:send` with a `tempId` and swap in the server's message from the ack
- [ ] `message:new` → add it to the matching messages query cache and update the conversation list (re-sort it, and bump unread when that chat isn't open)
- [ ] Emit `conversation:read` when a chat is open and focused; render seen/delivered ticks
- [ ] "typing…" indicator (throttled `typing:start`, `typing:stop` after 3s idle or on send)
- [ ] Online dot on avatars, plus "last seen" text in the chat header
- [ ] Show a banner while the connection is lost

## Acceptance criteria
- A two-browser manual test: live messages, typing, presence, and seen all work, and recover after the network drops
