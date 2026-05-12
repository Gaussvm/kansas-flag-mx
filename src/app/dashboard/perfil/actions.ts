"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "No autorizado" };
  }

  const first_name = formData.get("first_name") as string;
  const last_name = formData.get("last_name") as string;
  const nickname = formData.get("nickname") as string;
  const player_number = formData.get("player_number") as string;
  const height = formData.get("height") as string;
  const category = formData.get("category") as string;
  const quote = formData.get("quote") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      nickname,
      player_number,
      height,
      category,
      quote,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return { error: "Hubo un error al guardar tu perfil. Intenta de nuevo." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/perfil");
  revalidatePath("/dashboard/credencial");
  
  return { success: true };
}
