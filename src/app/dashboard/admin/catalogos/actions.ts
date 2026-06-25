"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  // Verify the requester is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const internalRoles = ['admin', 'master', 'director', 'staff_admin', 'staff', 'coach'];
  if (!profile || !internalRoles.includes(profile.role)) return { error: "No autorizado" };

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "El nombre es obligatorio" };

  const { error } = await supabase
    .from("categories")
    .insert([{ name, description }]);

  if (error) {
    console.error("Error creating category:", error);
    return { error: "No se pudo crear la categoría" };
  }

  revalidatePath("/dashboard/admin/catalogos");
  return { success: true };
}

export async function toggleCategoryStatus(categoryId: string, isActive: boolean) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const internalRoles = ['admin', 'master', 'director', 'staff_admin', 'staff', 'coach'];
  if (!profile || !internalRoles.includes(profile.role)) return { error: "No autorizado" };

  const { error } = await supabase
    .from("categories")
    .update({ is_active: isActive })
    .eq("id", categoryId);

  if (error) {
    console.error("Error updating category status:", error);
    return { error: "No se pudo actualizar el estado" };
  }

  revalidatePath("/dashboard/admin/catalogos");
  return { success: true };
}
