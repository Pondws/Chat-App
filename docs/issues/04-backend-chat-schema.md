# [Backend]: Prisma schema for conversations & messages

**Phase:** 1 — Backend core

## Proposed models
```prisma
model User {
  // existing fields...
  avatarUrl     String?
  lastSeenAt    DateTime?
  participants  ConversationParticipant[]
  messages      Message[]
}

model Conversation {
  id           Int      @id @default(autoincrement())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt   // bump on new message → sort chat list
  isGroup      Boolean  @default(false)
  name         String?
  participants ConversationParticipant[]
  messages     Message[]
}

model ConversationParticipant {
  conversationId Int
  userId         Int
  joinedAt       DateTime @default(now())
  lastReadAt     DateTime?            // unread count + "seen"
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@id([conversationId, userId])
}

model Message {
  id             Int      @id @default(autoincrement())
  createdAt      DateTime @default(now())
  text           String
  conversationId Int
  senderId       Int
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  sender         User         @relation(fields: [senderId], references: [id])
  @@index([conversationId, createdAt])
}
```

## Tasks
- [ ] Add the models and run `prisma migrate dev --name chat`
- [ ] Add a seed script with a few users and conversations for local dev

## Acceptance criteria
- The migration applies cleanly to a fresh DB, and `yarn db:seed` fills in demo data
