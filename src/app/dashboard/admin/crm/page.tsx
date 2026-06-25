import { createClient } from "@/lib/supabase/server";
import AthleteRegistration from "@/components/admin/AthleteRegistration";
import AthleteDirectory from "@/components/admin/AthleteDirectory";

export default async function CRMPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  const { data: profileLocations } = await supabase.from('profile_locations').select('location_id').eq('profile_id', user?.id);

  const { data: allLocations } = await supabase.from('locations').select('*').eq('is_active', true).order('name');
  
  let allowedLocations = allLocations || [];
  if (profile?.role === 'staff_admin') {
    const assignedIds = profileLocations?.map(pl => pl.location_id) || [];
    allowedLocations = allowedLocations.filter(loc => assignedIds.includes(loc.id));
  }

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
      ),
      locations:primary_location_id ( id, name )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Familias y CRM</h2>
        <p className="text-zinc-400 font-body text-sm mt-1">Gestión integral de atletas, tutores e inscripciones.</p>
      </div>

      <div className="w-full">
        <AthleteDirectory 
          athletes={athletes || []} 
          parents={parents || []} 
          programs={programs || []} 
          categories={categories || []} 
          locations={allowedLocations}
          currentUserRole={profile?.role || 'staff'}
        />
      </div>
    </div>
  );
}
