import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userA, userB, name } = body;

  if (!userA || !userB) return NextResponse.json({ error: "Missing user ids" }, { status: 400 });

  try {
    const { data: existing, error: findError } = await supabaseAdmin.rpc("get_chat_with_users", {
      user_ids: [userA, ...userB],
    });
    if (findError) throw findError;
    if (existing?.length) return NextResponse.json({ chatId: existing[0].chat_id });

    const { data: newChat, error: chatError } = await supabaseAdmin
      .from("chats")
      .insert({ group_name: name })
      .select("id")
      .single();
    if (chatError) throw chatError;

    const { error: participantsError } = await supabaseAdmin.rpc("add_chat_participants", {
      c_id: newChat.id,
      u_ids: [userA, ...userB],
    });
    if (participantsError) throw participantsError;

    return NextResponse.json({ chatId: newChat.id });
  } catch (error) {
    return NextResponse.json({ error: error || "Unknown error" }, { status: 500 });
  }
}
