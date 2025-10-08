"use client";
import React, { useEffect } from "react";
import { H1 } from "../../shared/text/H";
import P from "../../shared/text/P";
import { SplitText } from "gsap/SplitText";
import gsap from "gsap";
import IntroModel from "./IntroModel";

export default function Intro() {
  useEffect(() => {
    SplitText.create(".split-text", {
      type: "chars",
      autoSplit: true,
      onSplit: (self) => {
        return gsap.from(self.chars, {
          x: 150,
          opacity: 0,
          duration: 0.7,
          ease: "power4",
          stagger: 0.02,
          delay: 0.6,
        });
      },
    });

    SplitText.create(".split-title", {
      type: "words",
      autoSplit: true,
      onSplit: (self) => {
        return gsap.from(self.words, {
          y: -100,
          opacity: 0,
          rotation: "random(-80, 80)",
          duration: 0.7,
          ease: "back",
          stagger: 0.3,
        });
      },
    });
  }, []);

  return (
    <section className='lg:pt-10 md:pt-8 pt-5 text-center flex flex-col items-center gap-4'>
      <IntroModel />
      <H1 className='split-title'>Welcome to Twister</H1>
      <P variant={"secondary"} size={"lg"} className='split-text max-w-2xl'>
        Twister is your place for short and sharp thoughts. Post micro-messages, discover trending
        topics, and engage with the community. <br />
        Join the conversation and let your ideas twist around the world!
      </P>
    </section>
  );
}
