import { supabase } from "@/lib/supabaseClient";

export async function uploadImages(
  table: string,
  id: string,
  files?: File[],
): Promise<string[] | undefined> {
  if (!files || files.length === 0) return;

  const { data: oldFiles } = await supabase.storage.from(table).list(id);
  if (oldFiles) {
    const pathsToRemove = oldFiles.map((f) => `${id}/${f.name}`);
    if (pathsToRemove.length) await supabase.storage.from(table).remove(pathsToRemove);
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    const { data, error } = await supabase.storage
      .from(table)
      .upload(`${id}/${file.name}`, file, { cacheControl: "3600", upsert: true });
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from(table).getPublicUrl(data.path);

    uploadedUrls.push(publicUrlData.publicUrl);
  }

  return uploadedUrls;
}
