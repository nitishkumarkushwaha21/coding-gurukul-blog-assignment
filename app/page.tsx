import Link from "next/link";
import { BarChart3, BrainCircuit, FileText } from "lucide-react";

import { IdeaForm } from "@/components/IdeaForm";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Structured insight",
    description:
      "Generate opinionated reports that cover problem clarity, customer fit, market, competition, and stack.",
    icon: BrainCircuit
  },
  {
    title: "Decision-ready scoring",
    description: "Surface profitability score and risk level in a format that founders can scan quickly.",
    icon: BarChart3
  },
  {
    title: "Saved report history",
    description: "Keep each validation in one place and revisit earlier startup ideas from the dashboard.",
    icon: FileText
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <main className="container py-12 md:py-20">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight md:text-6xl">
                Validate your startup idea before you build the wrong thing.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Turn a rough concept into a founder-friendly report with AI-backed positioning,
                opportunity analysis, risk flags, and an MVP recommendation in minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="#validate">Start validating</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">View dashboard</Link>
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <Card key={title}>
                  <CardHeader className="pb-3">
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border bg-muted text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <section id="validate" className="lg:sticky lg:top-24">
            <IdeaForm />
          </section>
        </section>
      </main>
    </div>
  );
}
