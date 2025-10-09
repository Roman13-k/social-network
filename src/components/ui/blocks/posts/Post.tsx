"use client";
import { PostInterface } from "@/interfaces/post";
import { postDateFormat } from "@/utils/dates/postDateFormat";
import React, { useRef, useState } from "react";
import LikeButton from "../../shared/buttons/LikeButton";
import Link from "next/link";
import CommentButton from "../../shared/buttons/CommentButton";
import NewCommentModal from "../comments/NewCommentModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewComment } from "@/store/redusers/commentsReduser";
import P from "../../shared/text/P";
import { addPostView, PostsType, updateCommentsCout } from "@/store/redusers/postsReduser";
import { profanity } from "@/lib/profanity";
import RenderContentWithLinks from "../../layout/RenderContentWithLinks";
import PostImages from "./PostImages";
import PostViews from "./PostViews";
import { useObserver } from "@/hooks/useObserver";
import UserAvatar from "../../shared/UserAvatar";
import { AnimatePresence, motion } from "motion/react";

export default function Post({ post, type }: { post: PostInterface; type?: PostsType }) {
  const [commentModal, setCommentModal] = useState(false);
  const dispatch = useAppDispatch();
  const { error: commentError } = useAppSelector((state) => state.comments);
  const userId = useAppSelector((state) => state.user.user?.id);
  const loading = useAppSelector((state) => state.posts.loading);
  const postRef = useRef<null | HTMLLIElement>(null);

  const handleNewComment = async (content: string) => {
    if (!userId) return;
    await dispatch(createNewComment({ content, user_id: userId, post_id: post.id }));
    if (!commentError) {
      dispatch(updateCommentsCout({ count: 1, postId: post.id, type }));
      setCommentModal(false);
    }
  };

  const handleView = () => {
    if (userId && !post.viewed_by_user) dispatch(addPostView({ postId: post.id, userId }));
  };

  useObserver(handleView, loading, postRef, {
    threshold: 0.9,
  });

  return (
    <motion.li
      initial={{ opacity: 0, y: -50, scale: 0.75 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.75 }}
      transition={{ ease: "linear", duration: 0.5 }}
      ref={postRef}
      className='post-item flex items-start lg:px-5 md:px-4 px-3 lg:py-3 py-2 border-border border rounded-md w-full max-w-[650px] transition-all hover:bg-background-secondary/80'>
      <Link
        className='md:mr-2 mr-1 cursor-pointer'
        href={userId === post?.user?.id ? "/profile" : `/profile/${post?.user?.id}`}>
        <UserAvatar
          href={post?.user?.avatar_url}
          size={40}
          className='rounded-full lg:scale-100 md:scale-95 scale-85'
        />
      </Link>

      <div className='flex-1 flex flex-col md:gap-2 gap-1'>
        <Link className='flex gap-2 text-[17px] cursor-pointer' href={`/post/${post?.id}`}>
          <strong className='text-text-primary'>{post?.user?.username}</strong>
          <P variant={"secondary"}>· {postDateFormat(post?.created_at)}</P>
        </Link>

        <RenderContentWithLinks content={profanity.censor(post?.content)} />
        <PostImages imageUrls={post.image_url} />

        <div className='flex items-center w-full gap-6 md:gap-10 font-medium'>
          <LikeButton
            user_id={userId}
            post_id={post.id}
            count={post?.likes?.[0].count}
            liked_by_user={post?.liked_by_user}
          />
          <CommentButton
            setCommentModal={setCommentModal}
            count={post?.comments?.[0]?.count ?? 0}
          />
          <PostViews count={post?.post_views?.[0]?.count ?? 0} />
        </div>
      </div>
      <AnimatePresence>
        {commentModal && userId && (
          <NewCommentModal handleNewComment={handleNewComment} setCommentModal={setCommentModal} />
        )}
      </AnimatePresence>
    </motion.li>
  );
}
