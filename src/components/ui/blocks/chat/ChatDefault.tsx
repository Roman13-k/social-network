import React from "react";
import ChatContainer from "../../shared/containers/ChatContainer";
import { H2 } from "../../shared/text/H";

export default function ChatDefault() {
  return (
    <ChatContainer wrapper={`hidden lg:block`} className={`flex items-center justify-center `}>
      <div className='rounded-full bg-black/40 p-3 '>
        <H2 className='text-white'>Select a chat from the list</H2>
      </div>
    </ChatContainer>
  );
}
