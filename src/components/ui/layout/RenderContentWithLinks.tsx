import React from "react";
import P from "../shared/text/P";
import { emailSchema, linkSchema, phoneSchema } from "@/utils/validate/sсhemes";
import { ButtonVariant } from "@/types/button";

export default function RenderContentWithLinks({
  content,
  className,
  varinant = "secondary",
}: {
  content: string;
  className?: string;
  varinant?: ButtonVariant;
}) {
  const words = content?.split(/\s+/);

  return (
    <P className={className ?? ""} variant={varinant}>
      {words?.map((word, index) => {
        const isPhone = phoneSchema(word);
        const isLink = linkSchema(word);
        const isEmail = emailSchema(word);

        if (isPhone || isLink || isEmail) {
          return (
            <a
              key={index}
              href={isPhone ? `tel:${word}` : isEmail ? `mailto:${word}` : word}
              target='_blank'
              rel='noopener noreferrer'
              className='underline decoration-accent font-medium text-accent md:text-[16px] text-[15px] ml-1'>
              {word}
            </a>
          );
        }

        return (
          <React.Fragment key={index}>
            {index > 0 && " "}
            {word}
          </React.Fragment>
        );
      })}
    </P>
  );
}
