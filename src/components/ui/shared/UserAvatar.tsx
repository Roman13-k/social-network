import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import React from "react";

interface UserAvatarProps {
  className?: string;
  size: number;
  href?: string;
}

export default function UserAvatar({ className, size, href }: UserAvatarProps) {
  return href ? (
    <Image src={href} width={size} height={size} alt='profile' className={className} />
  ) : (
    <CircleUserRound size={size} className={className} />
  );
}
