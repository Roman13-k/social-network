import { ChatInterface } from "@/interfaces/chat";
import { CircleUserRound, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import P from "../../shared/text/P";
import Link from "next/link";
import DeleteDialog from "../../shared/dialog/DeleteDialog";

export default function ChatHeader({ activeChat }: { activeChat: ChatInterface | null }) {
  const handleDelete = () => {};

  return (
    <div className='py-4 px-5 bg-white w-full rounded-tr-lg'>
      <div className='flex gap-2 items-center'>
        <Link href={`/profile/${activeChat?.participants[0].id}`}>
          {activeChat?.participants?.[0]?.avatar_url ? (
            <Image
              className='rounded-full'
              src={activeChat?.participants[0]?.avatar_url}
              alt='avatar'
              width={40}
              height={40}
            />
          ) : (
            <CircleUserRound size={40} />
          )}
        </Link>

        <div>
          <P>{activeChat?.participants[0]?.username}</P>
          <span className='text-text-secondary text-sm'>was online in NaN</span>
        </div>

        <DeleteDialog
          handleAction={handleDelete}
          triger={
            <button className='ml-auto mr-10 cursor-pointer'>
              <Trash2 color='#ff0000' />
            </button>
          }
          trigerText={"Delete"}
        />
      </div>
    </div>
  );
}
