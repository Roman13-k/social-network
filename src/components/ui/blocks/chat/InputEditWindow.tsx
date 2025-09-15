import { MessageInterface } from "@/interfaces/message";
import React, { Dispatch, SetStateAction } from "react";
import P from "../../shared/text/P";
import { Pencil, X } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { canselEdit } from "@/store/redusers/messagesReduser";

export default function InputEditWindow({
  editingMessage,
  setMessage,
}: {
  editingMessage: MessageInterface;
  setMessage: Dispatch<SetStateAction<string>>;
}) {
  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center md:gap-5 gap-3 px-2 md:px-5 py-1 bg-white rounded-t-md max-w-[768px]'>
      <Pencil color='#1da1f2' className='shrink-0' />

      <div className='border-l-3 px-2 py-1 border-accent rounded-md bg-accent/30 flex-1 min-w-0'>
        <P size='xs' className='text-accent font-medium'>
          Edit Message
        </P>
        <P className='truncate' size='xs'>
          {editingMessage.content}
        </P>
      </div>

      <button
        className='cursor-pointer shrink-0'
        onClick={() => {
          dispatch(canselEdit());
          setMessage("");
        }}>
        <X color='#1da1f2' />
      </button>
    </div>
  );
}
