# [Frontend]: Chat window — history with infinite scroll & sending messages

**Phase:** 3 — Frontend integration
**Depends on:** messages API, chat list issue

## Tasks
- [ ] Replace `mockMessages` with `useInfiniteQuery` on `GET /conversations/:id/messages`
- [ ] Load older messages when the user scrolls to the top, keeping their scroll position; auto-scroll to the bottom for new messages
- [ ] Composer: Enter sends, Shift+Enter adds a newline; disabled when empty
- [ ] Optimistic send (show a pending state right away, roll back with a retry option on error)
- [ ] Group messages by day (date separators) and by consecutive sender
- [ ] Header shows the other user's name and avatar

## Acceptance criteria
- Sending feels instant, and history scrolls smoothly through 100+ messages
