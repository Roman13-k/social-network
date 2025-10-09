import { supabase } from "@/lib/supabaseClient";
import { mapAuthError } from "../mapAuthError";

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("username,id")
    .eq("id", userId)
    .single();

  if (error) throw mapAuthError(error);
  return data;
}
