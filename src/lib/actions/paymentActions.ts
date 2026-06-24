"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

/**
 * Reusable security verification for Admins (if needed explicitly)
 */
async function verifyAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    throw new Error("Acceso denegado: Se requiere rol de Administrador.");
  }
  return user;
}

export async function uploadReceiptAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");

  const enrollmentId = formData.get('enrollment_id') as string;
  const file = formData.get('file') as File;
  const amountStr = formData.get('amount') as string;

  if (!enrollmentId || !file) {
    throw new Error("Faltan datos requeridos.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("El archivo excede el límite de 5MB.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Formato de archivo no permitido. Usa JPG, PNG, WEBP o PDF.");
  }

  // Generate safe filename and UUID
  const receiptId = crypto.randomUUID();
  const extension = file.name.split('.').pop();
  const safeFilename = `${receiptId}.${extension}`;
  const filePath = `${enrollmentId}/${safeFilename}`;

  // 1. Upload to Storage
  const { error: uploadError } = await supabase.storage
    .from('receipts')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error("Error al subir archivo a Storage: " + uploadError.message);
  }

  // 2. Save record to Database
  const { error: dbError } = await supabase.from('payment_receipts').insert({
    id: receiptId,
    enrollment_id: enrollmentId,
    uploaded_by: user.id,
    file_path: filePath,
    file_name: file.name,
    mime_type: file.type,
    amount: amountStr ? parseFloat(amountStr) : null,
    status: 'pending_review'
  });

  if (dbError) {
    // If DB fails, try to clean up storage
    await supabase.storage.from('receipts').remove([filePath]);
    throw new Error("Error al registrar comprobante en BD: " + dbError.message);
  }

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function getReceiptSignedUrlAction(filePath: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.storage
    .from('receipts')
    .createSignedUrl(filePath, 60); // 60 seconds
    
  if (error || !data) {
    throw new Error("Error generando enlace seguro: " + (error?.message || "Desconocido"));
  }

  return { signedUrl: data.signedUrl };
}

export async function approveReceiptAction(receiptId: string, adminNotes?: string) {
  const supabase = await createClient();
  const adminUser = await verifyAdmin(supabase);

  // 1. Get receipt to know the enrollment
  const { data: receipt, error: fetchError } = await supabase.from('payment_receipts')
    .select('enrollment_id')
    .eq('id', receiptId)
    .single();

  if (fetchError || !receipt) throw new Error("Comprobante no encontrado.");

  // 2. Update Receipt
  const { error: updateReceiptError } = await supabase.from('payment_receipts')
    .update({
      status: 'approved',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes || null
    })
    .eq('id', receiptId);

  if (updateReceiptError) throw new Error("Error aprobando recibo: " + updateReceiptError.message);

  // 3. Update Enrollment
  const { error: updateEnrollError } = await supabase.from('enrollments')
    .update({ payment_status: 'paid' })
    .eq('id', receipt.enrollment_id);

  if (updateEnrollError) throw new Error("Recibo aprobado pero falló al actualizar inscripción.");

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function rejectReceiptAction(receiptId: string, adminNotes: string) {
  const supabase = await createClient();
  const adminUser = await verifyAdmin(supabase);

  if (!adminNotes) {
    throw new Error("Se requieren notas explicando el rechazo.");
  }

  // 1. Get receipt to know enrollment
  const { data: receipt, error: fetchError } = await supabase.from('payment_receipts')
    .select('enrollment_id')
    .eq('id', receiptId)
    .single();

  if (fetchError || !receipt) throw new Error("Comprobante no encontrado.");

  // 2. Update Receipt
  const { error: updateReceiptError } = await supabase.from('payment_receipts')
    .update({
      status: 'rejected',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes
    })
    .eq('id', receiptId);

  if (updateReceiptError) throw new Error("Error rechazando recibo: " + updateReceiptError.message);

  // 3. Optional logic: check if there are any other 'approved' receipts
  const { data: approvedReceipts } = await supabase.from('payment_receipts')
    .select('id')
    .eq('enrollment_id', receipt.enrollment_id)
    .eq('status', 'approved');

  // If no other approved receipts exist, ensure it is pending
  if (!approvedReceipts || approvedReceipts.length === 0) {
    await supabase.from('enrollments')
      .update({ payment_status: 'pending' })
      .eq('id', receipt.enrollment_id);
  }

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}
