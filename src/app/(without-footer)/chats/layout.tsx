import ChatList from "@/components/ui/blocks/chat/chat/chatlist/ChatList";
import React, { PropsWithChildren } from "react";

export default function ChatLayout({ children }: PropsWithChildren) {
  return (
    <div className='bg-background-primary h-[100dvh]'>
      <div className='flex px-4 md:px-8 lg:px-10 lg:pt-8 md:pt-6 pt-3 mx-auto max-w-[1440px] h-full'>
        <ChatList />
        {children}
      </div>
    </div>
  );
}
