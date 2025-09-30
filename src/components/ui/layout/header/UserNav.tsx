import React, { Dispatch, SetStateAction } from "react";
import { Button } from "../../shared/buttons/button";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../../shared/skeletons/skeleton";
import { H2 } from "../../shared/text/H";
import { CircleUserRound } from "lucide-react";
import UserAvatar from "../../shared/UserAvatar";

export default function UserNav({
  setLoginModal,
  hover = true,
  setBurgerMenu,
}: {
  setBurgerMenu?: Dispatch<SetStateAction<boolean>>;
  setLoginModal: Dispatch<SetStateAction<boolean>>;
  hover?: boolean;
}) {
  const { user, loading } = useAppSelector((state) => state.user);
  return (
    <div className='flex flex-col gap-3'>
      <H2 className='text-center'>
        {hover ? (
          <Link
            onClick={() => (setBurgerMenu ? setBurgerMenu(false) : "")}
            className='flex gap-1 items-center'
            href={"/"}>
            <Image src={"/phoenix.svg"} alt='phoenix' width={70} height={70} />
            <span>Twister</span>
          </Link>
        ) : (
          <Link href={"/"}>T</Link>
        )}
      </H2>
      <div className='flex gap-3 items-center'>
        {loading ? (
          <Skeleton className='h-[44px] w-[44px] rounded-full' />
        ) : user == null ? (
          <CircleUserRound size={48} />
        ) : (
          <Link onClick={() => (setBurgerMenu ? setBurgerMenu(false) : "")} href={"/profile"}>
            <UserAvatar href={user?.user_metadata?.avatar_url} size={48} className='rounded-full' />
          </Link>
        )}
        {hover && (
          <Button onClick={() => setLoginModal(true)} size={"lg"}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}
