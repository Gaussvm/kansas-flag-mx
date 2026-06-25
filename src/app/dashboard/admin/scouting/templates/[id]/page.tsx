import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TemplateBuilder from "@/components/admin/TemplateBuilder";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TemplateEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const isNew = resolvedParams.id === "new";
  const supabase = await createClient();

  let template = null;
  let metrics = [];

  if (!isNew) {
    const { data: tData } = await supabase
      .from("evaluation_templates")
      .select("*")
      .eq("id", resolvedParams.id)
      .single();

    if (!tData) notFound();
    template = tData;

    const { data: mData } = await supabase
      .from("evaluation_metrics")
      .select("*")
      .eq("template_id", resolvedParams.id)
      .order("sort_order", { ascending: true });

    metrics = mData || [];
  }

  // Fetch locations/programs for selectors (Admin only)
  const { data: locations } = await supabase.from("locations").select("id, name");
  const { data: programs } = await supabase.from("programs").select("id, name, location_id");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/scouting/templates">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            {isNew ? "Nueva Plantilla" : "Editar Plantilla"}
          </h1>
          <p className="text-slate-400">
            {isNew ? "Diseña las métricas para tu evaluación" : template?.name}
          </p>
        </div>
      </div>

      <TemplateBuilder 
        initialTemplate={template} 
        initialMetrics={metrics} 
        locations={locations || []}
        programs={programs || []}
      />
    </div>
  );
}
