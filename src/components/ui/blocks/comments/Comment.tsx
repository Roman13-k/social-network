import { CommentInterface } from "@/interfaces/comment";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCommentById } from "@/store/redusers/commentsReduser";
import { postDateFormat } from "@/utils/dates/postDateFormat";
import { Trash2 } from "lucide-react";
import React from "react";
import DeleteDialog from "../../shared/dialog/DeleteDialog";
import P from "../../shared/text/P";
import Link from "next/link";
import { updateCommentsCout } from "@/store/redusers/postsReduser";
import { profanity } from "@/lib/profanity";
import RenderContentWithLinks from "../../layout/RenderContentWithLinks";
import UserAvatar from "../../shared/UserAvatar";
import { motion } from "motion/react";

export default function Comment({ comment }: { comment: CommentInterface }) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state?.user?.user?.id);

  const hadleDeleteComment = async () => {
    const result = await dispatch(deleteCommentById(comment.id));
    if (deleteCommentById.fulfilled.match(result)) dispatch(updateCommentsCout({ count: -1 }));
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: -50, scale: 0.75 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.75 }}
      transition={{ ease: "easeOut", duration: 0.5 }}
      className='flex items-start md:px-5 px-3 md:py-3 py-2 border-border border rounded-md w-full max-w-[650px] transition-all hover:bg-background-secondary/80'>
      <Link
        href={userId === comment.user_id ? "/profile" : `/profile/${comment.user_id}`}
        className='mr-2'>
        <UserAvatar
          className='rounded-full md:scale-100 scale-90'
          size={40}
          href={comment.user.avatar_url}
        />
      </Link>
      <div className='flex flex-col gap-1 w-full'>
        <div className='flex gap-2 text-[17px] w-full'>
          <strong className='text-text-primary'>{comment.user.username}</strong>
          <P variant={"secondary"}>· {postDateFormat(comment.created_at)}</P>
          {userId === comment.user_id && (
            <DeleteDialog
              handleAction={hadleDeleteComment}
              triger={
                <button className='ml-auto cursor-pointer'>
                  <Trash2 color='#ff0000' />
                </button>
              }
              trigerText={"Delete"}
            />
          )}
        </div>
        <RenderContentWithLinks content={profanity.censor(comment?.content)} />
      </div>
    </motion.li>
  );
}
