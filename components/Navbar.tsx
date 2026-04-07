import Link from "next/link";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background">
            <div className="h-4 w-4 rounded-sm bg-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Startup Validator</p>
            <p className="text-xs text-muted-foreground">Idea screening workspace</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
