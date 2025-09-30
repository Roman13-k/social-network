"use client";
import React, { useState } from "react";
import Posts from "../ui/blocks/posts/Posts";
import NewPost from "../ui/blocks/posts/NewPost";
import NewPostModal from "../ui/blocks/posts/NewPostModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createNewPost, setLoading } from "@/store/redusers/postsReduser";
import { supabase } from "@/lib/supabaseClient";
import Intro from "../ui/blocks/home/Intro";

export default function HomeScreen() {
  const [postModal, setPostModal] = useState(false);
  const userId = useAppSelector((state) => state.user.user?.id);
  const { error, loading } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();

  async function uploadPostsImages(postId: string, files?: File[]): Promise<string[] | undefined> {
    if (!files || files.length === 0) return;
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const { data, error } = await supabase.storage
        .from("posts-images")
        .upload(`${postId}/${file.name}`, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from("posts-images").getPublicUrl(data.path);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return uploadedUrls;
  }

  const handleNewPost = async (content: string, files?: File[]) => {
    if (!content.trim() || !userId) return;

    dispatch(setLoading());
    const postId = crypto.randomUUID();
    const image_url = await uploadPostsImages(postId, files);
    await dispatch(createNewPost({ content, userId, image_url, postId }));
    if (!error && !loading) setPostModal(false);
  };

  return (
    <div className='flex flex-col lg:gap-10 md:gap-8 gap-6'>
      {postModal && <NewPostModal setPostModal={setPostModal} handleNewPost={handleNewPost} />}
      <Intro />
      <NewPost setPostModal={setPostModal} />
      <Posts />
    </div>
  );
}
