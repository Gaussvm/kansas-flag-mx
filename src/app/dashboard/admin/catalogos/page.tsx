import { createClient } from "@/lib/supabase/server";
import CategoriesTable from "./CategoriesTable";

export const metadata = {
  title: "Catálogos | Control Maestro",
};

export default async function CatalogosPage() {
  const supabase = await createClient();

  // Fetch all categories
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error);
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-headline font-black text-white uppercase tracking-wider">Gestión de Catálogos</h2>
          <p className="text-zinc-400 font-body text-sm mt-1">Configura las categorías oficiales de la liga (Varonil, Femenil, etc).</p>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <CategoriesTable initialCategories={categories || []} />
      </div>
    </div>
  );
}
