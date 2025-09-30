"use client";
import { redirect, useParams } from "next/navigation";
import React, { useEffect } from "react";
import Comments from "../ui/blocks/comments/Comments";
import Post from "../ui/blocks/posts/Post";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Link from "next/link";
import { deletePostById, getPostById } from "@/store/redusers/postsReduser";
import DeleteDialog from "../ui/shared/dialog/DeleteDialog";
import PostSkeleton from "../ui/shared/skeletons/PostSkeleton";
import NotFound from "@/app/not-found";

export default function PostScreen() {
  const params = useParams();
  const { currentPost, loading } = useAppSelector((state) => state.posts);
  const { loading: userLoading, user } = useAppSelector((state) => state?.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userLoading) return;
    if (params.id && !Array.isArray(params.id)) {
      dispatch(getPostById({ id: params.id, userId: user?.id }));
    }
  }, [params.id, user?.id, dispatch]);

  if ((!currentPost.content && !loading) || !params.id || Array.isArray(params.id))
    return <NotFound />;

  const handleDeletePost = () => {
    dispatch(deletePostById({ postId: currentPost.id, image_url: currentPost.image_url }));
    redirect("/");
  };

  return (
    <div className='flex flex-col items-center md:gap-8 gap-4 lg:gap-10 pt-10'>
      <nav className='text-sm text-text-secondary mb-4 font-medium text-[18px] self-start'>
        <Link
          href='/'
          className='text-text-secondary hover:text-accent font-medium text-[14px] md:text-[16px] lg:text-[18px]'>
          Главная
        </Link>{" "}
        / Пост {params.id}
      </nav>
      {loading || userLoading ? (
        <PostSkeleton />
      ) : (
        <div className='flex flex-col items-start gap-3 w-full max-w-[650px] mx-auto'>
          <Post post={currentPost} />
          {currentPost?.user?.id === user?.id && (
            <DeleteDialog handleAction={handleDeletePost} trigerText='Delete post' />
          )}
        </div>
      )}
      <Comments postId={params.id} />
    </div>
  );
}
