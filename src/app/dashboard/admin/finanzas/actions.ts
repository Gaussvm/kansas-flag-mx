"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createRate(formData: FormData) {
  const supabase = await createClient();

  // Verify the requester is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "No autorizado" };

  const name = formData.get("name") as string;
  const amountStr = formData.get("amount") as string;
  const category_id = formData.get("category_id") as string;

  if (!name || !amountStr) return { error: "El nombre y el monto son obligatorios" };

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return { error: "El monto debe ser un número mayor a 0" };

  const payload: any = { name, amount };
  if (category_id) {
    payload.category_id = category_id;
  }

  const { error } = await supabase
    .from("rates")
    .insert([payload]);

  if (error) {
    console.error("Error creating rate:", error);
    return { error: "No se pudo crear la tarifa" };
  }

  revalidatePath("/dashboard/admin/finanzas");
  return { success: true };
}

export async function toggleRateStatus(rateId: string, isActive: boolean) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autorizado" };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") return { error: "No autorizado" };

  const { error } = await supabase
    .from("rates")
    .update({ is_active: isActive })
    .eq("id", rateId);

  if (error) {
    console.error("Error updating rate status:", error);
    return { error: "No se pudo actualizar el estado" };
  }

  revalidatePath("/dashboard/admin/finanzas");
  return { success: true };
}
