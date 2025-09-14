"use client";
import React, { useEffect } from "react";
import Post from "./Post";
import { useAppSelector } from "@/store/hooks";
import { loadPosts } from "@/store/redusers/postsReduser";
import PostSkeleton from "../../shared/skeletons/PostSkeleton";
import RenderWithInfinityData from "../../layout/RenderWithInfinityData";
import P from "../../shared/text/P";

export default function Posts() {
  const { posts, loading: postLoading, error } = useAppSelector((state) => state.posts);
  const { user, loading } = useAppSelector((state) => state.user);
  const offset = useAppSelector((state) => state.posts.offset);

  const loadMore = () => {
    if (offset !== null) return loadPosts({ userId: user?.id, offset });
  };

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  return (
    <RenderWithInfinityData loading={postLoading || loading} callback={() => loadMore()}>
      {error && !loading ? (
        <P variant={"error"} size={"xs"}>
          {error.message}
        </P>
      ) : (
        <ul className='flex flex-col items-center gap-3 md:gap-5 w-full'>
          {posts?.map((post) => (
            <Post key={post.id} post={post} type={"posts"} />
          ))}
        </ul>
      )}
      {postLoading && (
        <ul className='flex flex-col items-center gap-3 md:gap-5 w-full'>
          {Array.from({ length: 2 }, (_, index) => (
            <PostSkeleton key={index} />
          ))}
        </ul>
      )}
    </RenderWithInfinityData>
  );
}
