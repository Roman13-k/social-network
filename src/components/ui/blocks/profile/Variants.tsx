"use client";
import React, { Dispatch, SetStateAction } from "react";
import { variants } from "@/utils/data/profile";
import { ProfileDataVariants } from "@/interfaces/profile";

interface VariantsProps {
  selectedVariant: ProfileDataVariants;
  setSelectedVariant: Dispatch<SetStateAction<ProfileDataVariants>>;
}

export default function Variants({ selectedVariant, setSelectedVariant }: VariantsProps) {
  return (
    <div className='flex flex-col items-start'>
      {variants.map((v, index) => (
        <button
          onClick={() => setSelectedVariant(v)}
          className={` px-1 py-1 lg:text-2xl text-xl hover:underline hover:text-accent/60 hover:decoration-accent/60 transition-all whitespace-nowrap ${
            selectedVariant.name === v.name
              ? "text-accent decoration-accent underline underline-offset-3"
              : "text-text-primary"
          } cursor-pointer`}
          key={index}>
          {v.displayName}
        </button>
      ))}
    </div>
  );
}
