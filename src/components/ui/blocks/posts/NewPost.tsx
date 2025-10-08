"use client";
import React, { Dispatch, SetStateAction, useRef } from "react";
import { Button } from "../../shared/buttons/button";
import { useAppSelector } from "@/store/hooks";
import { TooltipDemo } from "../../shared/tooltip";
import { H2 } from "../../shared/text/H";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(MorphSVGPlugin);

export default function NewPost({
  setPostModal,
}: {
  setPostModal: Dispatch<SetStateAction<boolean>>;
}) {
  const user = useAppSelector((state) => state.user.user);

  const arrowLine1 = useRef<SVGPathElement>(null);
  const arrowLine2 = useRef<SVGPathElement>(null);
  const plusLine1 = useRef<SVGPathElement>(null);
  const plusLine2 = useRef<SVGPathElement>(null);

  const onHover = () => {
    if (arrowLine1.current && plusLine1.current) {
      gsap.to(arrowLine1.current, { duration: 0.5, morphSVG: plusLine1.current });
    }
    if (arrowLine2.current && plusLine2.current) {
      gsap.to(arrowLine2.current, { duration: 0.5, morphSVG: plusLine2.current });
    }
  };

  const onHoverLeave = () => {
    if (arrowLine1.current && plusLine1.current) {
      gsap.to(arrowLine1.current, { duration: 0.5, morphSVG: arrowLine1.current });
    }
    if (arrowLine2.current && plusLine2.current) {
      gsap.to(arrowLine2.current, { duration: 0.5, morphSVG: arrowLine2.current });
    }
  };

  return (
    <section className='flex items-center gap-10'>
      <H2>Create a new post:</H2>
      {user ? (
        <Button
          onMouseEnter={onHover}
          onMouseLeave={onHoverLeave}
          variant={"default"}
          onClick={() => setPostModal(true)}
          size={"lg"}>
          New Post{" "}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='lucide lucide-arrow-right-icon'>
            <path
              ref={arrowLine1}
              d='M5 12h14'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <path
              ref={arrowLine2}
              d='m12 5 7 7-7 7'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
            />
            <path
              ref={plusLine1}
              d='M5 12h14'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              style={{ display: "none" }}
            />
            <path
              ref={plusLine2}
              d='M12 5v14'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              style={{ display: "none" }}
            />
          </svg>
        </Button>
      ) : (
        <TooltipDemo content='You must be logged in'>
          <Button disabled variant={"destructive"} size={"lg"}>
            New Post
          </Button>
        </TooltipDemo>
      )}
    </section>
  );
}
