import { navData } from "@/utils/data/nav";
import Image from "next/image";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

export default function Nav({
  hover = true,
  setBurgerMenu,
}: {
  hover?: boolean;
  setBurgerMenu?: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <nav>
      <ul className={`flex flex-col gap-5 font-medium text-[18px] ${hover ? "" : "items-center"}`}>
        {navData.map((item, index) => (
          <li className='flex gap-2 items-center' key={index}>
            <Image src={item.icon} alt='' width={30} height={30} />
            {hover && (
              <Link
                onClick={() => (setBurgerMenu ? setBurgerMenu(false) : "")}
                className='text-text-secondary hover:text-accent'
                href={item.href}>
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
