import { DashboardIdeas } from "@/components/DashboardIdeas";
import { Navbar } from "@/components/Navbar";
import { getIdeas } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const ideas = await getIdeas();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container py-12">
        <div className="mb-10 flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.2em] text-primary/80">Dashboard</p>
          <h1 className="text-4xl font-semibold tracking-tight">Saved startup validations</h1>
          <p className="max-w-2xl text-muted-foreground">
            Every generated report appears here so you can compare ideas, revisit assumptions, and
            keep a clean record of what was worth pursuing.
          </p>
        </div>

        <DashboardIdeas initialIdeas={ideas} />
      </main>
    </div>
  );
}
