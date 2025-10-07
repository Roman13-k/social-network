"use client";
import React, { useState } from "react";
import Posts from "../ui/blocks/posts/Posts";
import NewPost from "../ui/blocks/posts/NewPost";
import NewPostModal from "../ui/blocks/posts/NewPostModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewPost, setLoading } from "@/store/redusers/postsReduser";
import Intro from "../ui/blocks/home/Intro";
import { uploadImages } from "@/utils/uploadImages";

export default function HomeScreen() {
  const [postModal, setPostModal] = useState(false);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { error, loading } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  const handleNewPost = async (content: string, files?: File[]) => {
    if (!content.trim() || !userId) return;

    dispatch(setLoading());
    const postId = crypto.randomUUID();
    const image_url = await uploadImages("posts-images", postId, files);
    await dispatch(createNewPost({ content, userId, image_url, postId }));
    if (!error && !loading) setPostModal(false);
  };

  return (
    <div className='flex flex-col lg:gap-10 md:gap-8 gap-6'>
      {postModal && <NewPostModal setPostModal={setPostModal} handleNewPost={handleNewPost} />}
      <Intro />
      {/* search for a good model */}
      {/* <IntroModel /> */}
      <NewPost setPostModal={setPostModal} />
      <Posts />
    </div>
  );
}
