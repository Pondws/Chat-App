# [Frontend]: Chat list from API + start a new chat via user search

**Phase:** 3 — Frontend integration
**Depends on:** conversations & users APIs

## Tasks
- [ ] Replace `mockChatList` with `useConversations()` (`GET /conversations`)
- [ ] Show the avatar, name, last message preview, relative time (`date-fns`), and an unread badge
- [ ] Hook up the sidebar search input: filter existing chats, and show matching users from `GET /users?search=` (debounced)
- [ ] Clicking a user calls `POST /conversations` and opens that chat
- [ ] Routing: `/chat/[conversationId]` (or `?c=` param) so a chat can be deep-linked
- [ ] Loading skeletons and an empty state

## Acceptance criteria
- A new user can find another user, start a chat, and see it in the list
