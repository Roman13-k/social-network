"use client";
import React from "react";
import Post from "./Post";
import { useAppSelector } from "@/store/hooks";
import { loadPosts } from "@/store/redusers/postsReduser";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";
import RenderWithInfinityData from "../../layout/RenderWithInfinityData";
import RenderOrError from "../../layout/RenderOrError";
import { AnimatePresence } from "motion/react";

export default function Posts() {
  const { posts, loading: postLoading, error } = useAppSelector((state) => state.posts);
  const { user, loading } = useAppSelector((state) => state.user);
  const offset = useAppSelector((state) => state.posts.offset);

  const loadMore = () => {
    if (offset !== null) return loadPosts({ userId: user?.id, offset });
  };

  return (
    <RenderWithInfinityData loading={postLoading || loading} callback={() => loadMore()}>
      <RenderOrError error={error}>
        <ul className='flex flex-col items-center gap-3 md:gap-5 w-full'>
          <AnimatePresence>
            {posts?.map((post) => (
              <Post key={post.id} post={post} type={"posts"} />
            ))}
          </AnimatePresence>
        </ul>

        {postLoading && (
          <ul className='flex flex-col items-center gap-3 md:gap-5 w-full'>
            {Array.from({ length: 2 }, (_, index) => (
              <PostSkeleton key={index} />
            ))}
          </ul>
        )}
      </RenderOrError>
    </RenderWithInfinityData>
  );
}
