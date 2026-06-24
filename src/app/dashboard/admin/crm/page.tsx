import { createClient } from "@/lib/supabase/server";
import AthleteRegistration from "@/components/admin/AthleteRegistration";
import AthleteDirectory from "@/components/admin/AthleteDirectory";

export default async function CRMPage() {
  const supabase = await createClient();

  // Get active programs
  const { data: programs } = await supabase
    .from("programs")
    .select("id, name, start_date")
    .eq("status", "active")
    .order("start_date", { ascending: false });

  // Get parents with their emails from profiles table
  const { data: parents } = await supabase
    .from("profiles")
    .select("id, email, first_name, last_name")
    .eq("role", "parent")
    .order("email", { ascending: true });

  // Get categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  // Get all athletes with their guardian and enrollment info for the table
  const { data: athletes } = await supabase
    .from("athletes")
    .select(`
      *,
      guardian_athletes (
        guardian_id,
        relationship,
        profiles ( id, email, first_name, last_name )
      ),
      enrollments (
        id,
        program_id,
        status,
        payment_status,
        programs ( id, name ),
        payment_receipts (
          id,
          file_path,
          file_name,
          status,
          amount,
          admin_notes,
          created_at,
          profiles:profiles!payment_receipts_uploaded_by_fkey ( first_name, last_name, email )
        )
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Familias y CRM</h2>
        <p className="text-zinc-400 font-body text-sm mt-1">Gestión integral de atletas, tutores e inscripciones.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <AthleteRegistration parents={parents || []} programs={programs || []} categories={categories || []} />
        </div>

        <div className="xl:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-white uppercase tracking-wide">Directorio de Atletas</h3>
          </div>
          
          <AthleteDirectory 
            athletes={athletes || []} 
            parents={parents || []} 
            programs={programs || []} 
            categories={categories || []} 
          />
        </div>
      </div>
    </div>
  );
}
