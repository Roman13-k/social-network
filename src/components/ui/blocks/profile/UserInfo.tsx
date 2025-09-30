"use client";
import React from "react";
import { H1 } from "../../shared/text/H";
import P from "../../shared/text/P";
import { CurrentProfileType, isUserInterface } from "@/types/user";
import { getUserAvatar, getUserEmail, getUserName } from "@/utils/userGetInfo";
import { Button } from "../../shared/buttons/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getOrCreateNewChat } from "@/store/redusers/chatsReduser";
import { useRouter } from "next/navigation";
import UserAvatar from "../../shared/UserAvatar";

export default function UserInfo({ user }: { user: CurrentProfileType }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.chats);
  const regProfileId = useAppSelector((state) => state?.user?.user?.id);
  const userInfo = [
    { name: "Email: ", value: getUserEmail(user) },
    { name: "Count of posts: ", value: user?.stats?.posts_count },
    { name: "Count of likes: ", value: user?.stats?.likes_count },
    { name: "Count of comments: ", value: user?.stats?.comments_count },
  ];
  const userAvatar = getUserAvatar(user);

  const handleCreateOrGoChat = async () => {
    if (!user?.id || !regProfileId) return;

    const chatId = await dispatch(getOrCreateNewChat({ userA: regProfileId, userB: user?.id }));
    if (!error && !loading) router.push(`/chats/${chatId.payload}`);
  };

  return (
    <section>
      <div className='flex sm:flex-row flex-col items-center gap-6'>
        <H1>Hi, {getUserName(user)}</H1>
        {!isUserInterface(user) && (
          <Button
            disabled={loading || !!error || !regProfileId}
            loading={loading}
            onClick={handleCreateOrGoChat}
            variant={"secondary"}>
            send a message
          </Button>
        )}
      </div>
      <div className='flex items-center lg:gap-5 gap-3'>
        <UserAvatar
          href={userAvatar}
          size={196}
          className='rounded-full w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48'
        />

        <ul className='flex flex-col gap-2 lg:gap-3'>
          {userInfo.map((inf, index) => (
            <li key={index}>
              <P size={"lg"}>
                <span className='text-text-primary'>{inf.name}</span>
                <span className='text-text-secondary'>{inf.value}</span>
              </P>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
