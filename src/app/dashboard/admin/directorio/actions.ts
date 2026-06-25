"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, newRole: string) {
  const supabase = await createClient();

  // Verify the requester is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const internalRoles = ['admin', 'master', 'director', 'staff_admin', 'staff', 'coach'];
  if (!profile || !internalRoles.includes(profile.role)) return { error: "No autorizado" };

  // Update target user's role
  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Error updating role:", error);
    return { error: "No se pudo actualizar el rol" };
  }

  revalidatePath("/dashboard/admin/directorio");
  return { success: true };
}
