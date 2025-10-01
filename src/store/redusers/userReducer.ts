import { ErrorState } from "@/interfaces";
import { UserInterface, UserMainInfo } from "@/interfaces/user";
import { supabase } from "@/lib/supabaseClient";
import { LoginProviderType } from "@/types/login";
import { ProfileWithStats } from "@/types/user";
import { addAsyncCase } from "@/utils/addAsyncCase";
import { mapAuthError } from "@/utils/mapAuthError";
import { mapUserWithStats } from "@/utils/mapUserWithStats";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: UserInterface | null;
  profile: ProfileWithStats | null;
  loading: boolean;
  error: ErrorState | null;
}

const initialState: UserState = {
  user: null,
  profile: null,
  loading: true,
  error: null,
};

export const loginUser = createAsyncThunk<
  UserInterface | null,
  LoginProviderType,
  { rejectValue: ErrorState }
>("user/loginUser", async (provider, { rejectWithValue }) => {
  const { error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) return rejectWithValue(mapAuthError(error));

  const { data: sessionData, error: userError } = await supabase.auth.getUser();
  if (userError) return rejectWithValue(mapAuthError(userError));

  if (!sessionData.user) return null;
  return mapUserWithStats(sessionData.user);
});

export const loginWithEmail = createAsyncThunk<
  UserInterface | null,
  { email: string; password: string },
  { rejectValue: ErrorState }
>("user/loginWithEmail", async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return rejectWithValue(mapAuthError(error));
  if (!data.user) return null;
  return mapUserWithStats(data.user);
});

export const registerUser = createAsyncThunk<
  UserInterface | null,
  { email: string; password: string },
  { rejectValue: ErrorState }
>("user/registerUser", async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return rejectWithValue(mapAuthError(error));
  if (!data.user) return null;
  return mapUserWithStats(data.user);
});

export const fetchSession = createAsyncThunk<
  UserInterface | null,
  void,
  { rejectValue: ErrorState }
>("user/fetchSessionWithStats", async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session?.user) return null;

  const userId = session.user.id;

  const { data: statsData, error: statsError } = await supabase.rpc("get_user_stats", {
    p_user_id: userId,
  });
  if (statsError) throw statsError;

  return mapUserWithStats(session.user, statsData?.[0]);
});

export const getProfileById = createAsyncThunk<
  ProfileWithStats | null,
  string,
  { rejectValue: ErrorState }
>("user/getProfileById", async (userId, { rejectWithValue }) => {
  const { data, error } = await supabase
    .rpc("get_full_user", { p_user_id: userId })
    .single<UserMainInfo>();

  if (error) return rejectWithValue(mapAuthError(error));

  const { data: statsData, error: statsError } = await supabase.rpc("get_user_stats", {
    p_user_id: userId,
  });
  if (statsError) return rejectWithValue(mapAuthError(statsError));

  return mapUserWithStats(data, statsData?.[0]);
});

export const changeUserInfo = createAsyncThunk<User, object, { rejectValue: ErrorState }>(
  "user/changeUserInfo",
  async (newUser) => {
    const { error, data } = await supabase.auth.updateUser({
      data: newUser,
    });
    if (error) throw error;
    return data.user;
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.error = null;
      state.user = null;
      supabase.auth.signOut();
    },
  },
  extraReducers: (builder) => {
    addAsyncCase(builder, loginUser, (state, action) => {
      state.user = action.payload;
    }),
      addAsyncCase(builder, loginWithEmail, (state, action) => {
        state.user = action.payload;
      }),
      addAsyncCase(builder, registerUser, (state, action) => {
        state.user = action.payload;
      }),
      addAsyncCase(builder, fetchSession, (state, action) => {
        state.user = action.payload;
        if (!action.payload) {
          state.error = { message: "You are not logged in", code: "not_login" };
        } else {
          state.error = null;
        }
      });
    addAsyncCase(builder, getProfileById, (state, action) => {
      state.profile = action.payload;
      if (!action.payload) {
        state.error = { message: "No profile with this ID", code: "not_profile" };
      } else {
        state.error = null;
      }
    });
    addAsyncCase(builder, changeUserInfo, (state, action) => {
      if (state.user && action.payload?.user_metadata) {
        state.user.user_metadata = {
          ...state.user.user_metadata,
          ...Object.fromEntries(
            Object.entries(action.payload.user_metadata).filter(([_, v]) => v !== undefined),
          ),
        };
      }
    });
  },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
