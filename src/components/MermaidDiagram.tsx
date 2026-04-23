"use client";

// Renders Mermaid chart text into SVG on the client.

import { useEffect, useMemo, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
}

let initialized = false;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const id = useMemo(() => `mermaid-${Math.random().toString(36).slice(2, 10)}`, []);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        if (!initialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: "strict",
            theme: "default",
          });
          initialized = true;
        }

        const result = await mermaid.render(id, chart);

        if (!cancelled) {
          setError("");
          setSvg(result.svg);
        }
      } catch {
        if (!cancelled) {
          setSvg("");
          setError("Failed to render Mermaid diagram.");
        }
      }
    }

    void render();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="my-8 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div
      className="my-8 overflow-x-auto rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
