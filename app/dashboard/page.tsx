import { Navbar } from "@/components/Navbar";
import { ReportCard } from "@/components/ReportCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

        {ideas.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>No ideas yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your validated startup ideas will appear here once you submit the first one.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ideas.map((idea) => (
              <ReportCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
