"use client";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect } from "react";
import Comment from "./Comment";
import { loadComments, resetComments } from "@/store/redusers/commentsReduser";
import CommentSkeleton from "../../shared/skeletons/CommentSkeleton";
import RenderWithInfinityData from "../../layout/RenderWithInfinityData";
import RenderOrError from "../../layout/RenderOrError";

export default function Comments({ postId }: { postId: string }) {
  const { comments, loading, offset, error } = useAppSelector((state) => state.comments);
  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetComments());
    };
  }, [dispatch]);

  const loadMore = () => {
    if (offset !== null) return loadComments({ offset, postId });
  };

  return (
    <RenderWithInfinityData callback={loadMore} loading={loading}>
      <RenderOrError error={error}>
        <ul className='flex flex-col gap-3 md:gap-5 w-full max-w-[650px]'>
          {comments.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </ul>

        {loading && (
          <div className='flex flex-col gap-3 md:gap-5 w-full max-w-[650px]'>
            <CommentSkeleton />
            <CommentSkeleton />
          </div>
        )}
      </RenderOrError>
    </RenderWithInfinityData>
  );
}
