import { ErrorState } from "@/interfaces";
import { PostInterface } from "@/interfaces/post";
import { supabase } from "@/lib/supabaseClient";
import { addAsyncCase } from "@/utils/addAsyncCase";
import { mapAuthError } from "@/utils/mapAuthError";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const limit = 5;

export type PostsType = "userPosts" | "userLikedPosts" | "posts";

interface PostState {
  posts: PostInterface[];
  userPosts: PostInterface[];
  userLikedPosts: PostInterface[];
  currentPost: PostInterface;
  loading: boolean;
  error: ErrorState | null;
  offset: number | null;
  userOffset: number | null;
  userLikedOffset: number | null;
}

const initialState: PostState = {
  posts: [],
  userLikedPosts: [],
  userPosts: [],
  currentPost: { comments: [{ count: 0 }] } as PostInterface,
  loading: false,
  error: null,
  offset: 0,
  userLikedOffset: 0,
  userOffset: 0,
};

const postInformation = `
  id,
  content,
  created_at,
  likes(count),
  comments(count),
  post_views(count),
  viewed_by_user:post_views(user_id),
  user:profiles (
    id,
    username,
    avatar_url
  ),
  liked_by_user:likes (
    user_id
  ),
  image_url
`;

export const createNewPost = createAsyncThunk<
  PostInterface[],
  { content: string; userId: string; image_url?: string[]; postId: string },
  { rejectValue: ErrorState }
>("posts/createNewPost", async ({ content, userId, image_url, postId }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("posts")
    .insert([{ content, user_id: userId, image_url, id: postId }])
    .select(postInformation);
  if (error) return rejectWithValue(mapAuthError(error));

  return data.map((post) => ({
    ...post,
    liked_by_user: false,
    viewed_by_user: false,
    user: Array.isArray(post.user) ? post.user[0] : post.user,
  }));
});

export const deletePostById = createAsyncThunk<
  string,
  { postId: string; image_url: string[] | undefined },
  { rejectValue: ErrorState }
>("posts/deletePost", async ({ postId, image_url }, { rejectWithValue }) => {
  if (image_url && image_url?.length !== 0) {
    for (const url of image_url) {
      const parts = url.split("/public/posts-images/");
      await supabase.storage.from("posts-images").remove([parts[1]]);
    }
  }
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return rejectWithValue(mapAuthError(error));

  return postId;
});

export const loadPosts = createAsyncThunk<
  PostInterface[],
  { userId?: string; offset: number },
  { rejectValue: ErrorState }
>("posts/loadPosts", async ({ userId, offset }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("posts")
    .select(postInformation)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });
  if (error) return rejectWithValue(mapAuthError(error));

  return data.map((post) => ({
    ...post,
    viewed_by_user: userId ? post.viewed_by_user.some((view) => view.user_id === userId) : false,
    liked_by_user: userId ? post.liked_by_user.some((like) => like.user_id === userId) : false,
    user: Array.isArray(post.user) ? post.user[0] : post.user,
  }));
});

export const getPostById = createAsyncThunk<
  PostInterface,
  { id: string; userId?: string },
  { rejectValue: ErrorState }
>("posts/getPostById", async ({ id, userId }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("posts")
    .select(postInformation)
    .eq("id", id)
    .single();
  if (error) return rejectWithValue(mapAuthError(error));

  return {
    ...data,
    viewed_by_user: userId ? data.viewed_by_user.some((view) => view.user_id === userId) : false,
    liked_by_user: userId ? data.liked_by_user.some((like) => like.user_id === userId) : false,
    user: Array.isArray(data.user) ? data.user[0] : data.user,
  };
});

export const loadUserPosts = createAsyncThunk<
  PostInterface[],
  { userId?: string; offset: number },
  { rejectValue: ErrorState }
>("posts/loadUserPosts", async ({ userId, offset }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("posts")
    .select(postInformation)
    .eq("user_id", userId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });
  if (error) return rejectWithValue(mapAuthError(error));
  if (!data) return [];

  return data.map((post) => ({
    ...post,
    viewed_by_user: userId ? post.viewed_by_user.some((view) => view.user_id === userId) : false,
    liked_by_user: userId ? post.liked_by_user?.some((like) => like.user_id === userId) : false,
    user: Array.isArray(post.user) ? post.user[0] : post.user,
  }));
});

export const loadUserLikedPosts = createAsyncThunk<
  PostInterface[],
  { userId?: string; offset: number },
  { rejectValue: ErrorState }
>("posts/loadUserLikedPosts", async ({ userId, offset }, { rejectWithValue }) => {
  const { data, error } = await supabase
    .from("likes")
    .select(
      `
      post:post_id (
        ${postInformation}
      )
    `,
    )
    .eq("user_id", userId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) return rejectWithValue(mapAuthError(error));
  if (!data) return [];

  return data.map((item) => {
    const post = item.post as unknown as PostInterface;
    return {
      ...post,
      viewed_by_user: true,
      liked_by_user: true,
      user: post.user,
    };
  });
});

export const addPostView = createAsyncThunk<
  { postId: string; userId: string },
  { postId: string; userId: string },
  { rejectValue: ErrorState }
>("posts/addPostView", async ({ postId, userId }, { rejectWithValue }) => {
  const { error } = await supabase.from("post_views").insert({ post_id: postId, user_id: userId });
  if (error) {
    return rejectWithValue(error);
  }

  return { postId, userId };
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    updateCommentsCout: (
      state,
      action: PayloadAction<{ count: number; postId?: string; type?: PostsType }>,
    ) => {
      const { count, postId, type } = action.payload;
      if (postId && type) {
        const post = state[type].find((post) => post.id === postId);
        if (post?.comments?.[0]) {
          post.comments[0].count += count;
        }
      }
      state.currentPost.comments[0].count += count;
    },
  },
  extraReducers: (builder) => {
    addAsyncCase(builder, createNewPost, (state, action) => {
      state.posts = [...action.payload, ...state.posts];
    });
    addAsyncCase(builder, loadPosts, (state, action) => {
      if (action.payload.length === 0) {
        state.offset = null;
      } else if (state.offset !== null) {
        state.posts.push(...action.payload);
        state.offset += limit;
      }
    });
    addAsyncCase(builder, deletePostById, (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    });
    addAsyncCase(builder, getPostById, (state, action) => {
      state.currentPost = action.payload;
    });
    addAsyncCase(builder, loadUserPosts, (state, action) => {
      if (action.payload.length === 0) {
        state.userOffset = null;
      } else if (state.userOffset !== null) {
        state.userPosts.push(...action.payload);
        state.userOffset += limit;
      }
    });
    addAsyncCase(builder, loadUserLikedPosts, (state, action) => {
      if (action.payload.length === 0) {
        state.userLikedOffset = null;
      } else if (state.userLikedOffset !== null) {
        state.userLikedPosts.push(...action.payload);
        state.userLikedOffset += limit;
      }
    });
    addAsyncCase(builder, addPostView, (state, action) => {
      const { postId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (post && !post.viewed_by_user) {
        post.viewed_by_user = true;
        post.post_views[0].count += 1;
      }
    });
  },
});

export const { setLoading, updateCommentsCout } = postsSlice.actions;

export default postsSlice.reducer;
