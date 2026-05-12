import { createClient } from "@/lib/supabase/server";
import RatesTable from "./RatesTable";

export const metadata = {
  title: "Finanzas y Tarifas | Control Maestro",
};

export default async function FinanzasPage() {
  const supabase = await createClient();

  // Fetch all rates with their associated category names
  const { data: rates, error } = await supabase
    .from("rates")
    .select(`
      *,
      categories (
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rates:", error);
  }

  // Fetch active categories for the dropdown in the creation modal
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("is_active", true)
    .order("name");

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-headline font-black text-white uppercase tracking-wider">Finanzas y Tarifas</h2>
          <p className="text-zinc-400 font-body text-sm mt-1">Configura los costos de inscripción, arbitraje y mensualidades.</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <RatesTable initialRates={rates || []} categories={categories || []} />
      </div>
    </div>
  );
}
