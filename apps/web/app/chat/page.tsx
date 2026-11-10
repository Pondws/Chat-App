"use client"

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { H2, H4, P } from '@/components/ui/typography';
import { format } from 'date-fns'
import { ChevronsUpDown, LogOut, Search, Send, Settings } from 'lucide-react';
import Link from 'next/link';

const mockChatList = [
  {
    id: "chat-1",
    user: {
      id: "user-1",
      name: "John Doe",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    lastMessage: {
      text: "Hey, how are you?",
      createdAt: "2026-04-24T10:00:00Z",
      senderId: "user-1",
    },
    unreadCount: 2,
  },
  {
    id: "chat-2",
    user: {
      id: "user-2",
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    lastMessage: {
      text: "Let's meet tomorrow",
      createdAt: "2026-04-24T09:30:00Z",
      senderId: "me",
    },
    unreadCount: 0,
  },
]

const mockMessages = [
  {
    id: "msg-1",
    chatId: "chat-1",
    sender: {
      id: "me",
      name: "Me",
    },
    text: "Hello!",
    createdAt: "2026-04-24T10:00:00Z",
    status: "seen", // sent | delivered | seen
  },
  {
    id: "msg-2",
    chatId: "chat-1",
    sender: {
      id: "user-2",
      name: "Jane Smith",
    },
    text: "Hi! How are you?",
    createdAt: "2026-04-24T10:01:00Z",
    status: "seen",
  },
  {
    id: "msg-3",
    chatId: "chat-1",
    sender: {
      id: "me",
      name: "Me",
    },
    text: "I'm good, working on a project.",
    createdAt: "2026-04-24T10:02:00Z",
    status: "delivered",
  },
  {
    id: "msg-4",
    chatId: "chat-1",
    sender: {
      id: "user-2",
      name: "Jane Smith",
    },
    text: "Nice! Good luck 🚀",
    createdAt: "2026-04-24T10:03:00Z",
    status: "seen",
  },
]

export default function Home() {
  return (
    <div className="grid md:grid-cols-10 h-screen gap-3 p-3 bg-secondary overflow-hidden">
      <div className="md:col-span-2">
        <Card className="h-full p-4 flex flex-col">
          <div className="shrink-0">
            <H2>Chat</H2>
          </div>

          <div className="shrink-0">
            <Input
              type="text"
              className='bg-secondary border-0'
              placeholder='ค้นหา'
              leftIcon={<Search color="#828282" size={20} />}
            />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-2">
            {mockChatList.map((data) => (
              <div
                key={data.id}
                className="flex gap-3"
              >
                <img
                  src={data.user.avatar}
                  alt={data.user.name}
                  className="rounded-full size-10 self-center"
                />
                <div className="flex flex-col">
                  <P>{data.user.name}</P>
                  <P>{data.lastMessage.text}</P>
                </div>

                <div className="flex-1 text-end">
                  <P>
                    {format(data.lastMessage.createdAt, 'dd/MM')}
                  </P>
                </div>
              </div>
            ))}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size='lg'
                variant='ghost'
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <P className="flex-1 text-left text-sm leading-tight">
                  {/* <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span> */}
                  test
                </P>
                <ChevronsUpDown className="ml-auto size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
            >
              <DropdownMenuGroup>
                <Link href="/setting">
                  <DropdownMenuItem>
                    <Settings />
                    ตั้งค่า
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
              // onClick={() => logout()}
              >
                <LogOut />
                ออกจากระบบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </div>

      <div className="md:col-span-8">
        <Card className="flex flex-col h-full">
          <CardHeader className='shrink-0'>
            <H4>Jojo</H4>
          </CardHeader>

          <CardContent className='flex-1 min-h-0 overflow-y-auto'>
            <div className="space-y-3">
              {mockMessages.map((msg) => {
                const isMe = msg.sender.id === "me";

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`
                        max-w-[70%]
                        rounded-2xl
                        px-4 py-2
                        ${isMe
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-muted rounded-bl-sm"
                        }
                      `}
                    >
                      <P>{msg.text}</P>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className='shrink-0 flex gap-2'>
            <Input
              className='bg-secondary border-0 h-10'
              placeholder='ข้อความ'
            />

            <Button className='w-12 h-10'>
              <Send color="#ffffff" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
