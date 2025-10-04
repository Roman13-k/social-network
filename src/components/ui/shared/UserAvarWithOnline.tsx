import React from "react";
import UserAvatar from "./UserAvatar";
import { UserMainInfo } from "@/interfaces/user";

export default function UserAvarWithOnline({ user }: { user: UserMainInfo | undefined }) {
  return (
    <div className='relative'>
      <UserAvatar href={user?.avatar_url} size={40} className='rounded-full' />
      {user?.isOnline && (
        <div className='absolute bottom-0 right-0 block w-3 h-3 bg-button rounded-full'></div>
      )}
    </div>
  );
}
