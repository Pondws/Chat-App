# [Backend]: Real-time messaging with Socket.IO

**Phase:** 2 — Real-time
**Depends on:** messages API

## Tasks
- [ ] Attach `socket.io` to the Express HTTP server (share the CORS config)
- [ ] Authenticate the handshake with the JWT access token (`socket.handshake.auth.token`); reject invalid tokens
- [ ] On connect, join `user:<id>` (each user only joins their own room)
- [ ] Event `message:send` `{ conversationId, text, tempId }`: persist through the messages service, ack with the saved message (so the client can swap out `tempId`), and emit `message:new` to every participant's `user:<id>` room
- [ ] Have the REST `POST /conversations/:id/messages` emit `message:new` too, so both paths behave the same
- [ ] Emit `conversation:updated` so chat lists can re-sort and update unread counts

## Acceptance criteria
- With two browsers logged in as different users, a message shows up for the other user within about 1s, without a refresh
