import { notFound } from "next/navigation";

import { ExportPDFButton } from "@/components/ExportPDFButton";
import { Navbar } from "@/components/Navbar";
import { ReportFull } from "@/components/ReportFull";
import { getIdeaById } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ReportPage({
  params
}: {
  params: { id: string };
}) {
  const idea = await getIdeaById(params.id);

  if (!idea) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-12">
        <div className="mb-6 flex justify-end">
          <ExportPDFButton idea={idea} />
        </div>
        <ReportFull idea={idea} />
      </main>
    </div>
  );
}
