// Renders a responsive YouTube iframe embed inside article content.
import React from "react";

interface YouTubeEmbedProps {
  id: string;
  title?: string;
}

export function YouTubeEmbed({ id, title = "YouTube video" }: YouTubeEmbedProps) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-slate-200 bg-black">
      <div className="relative h-0 w-full pb-[56.25%]">
        <iframe
          src={`https://www.youtube.com/embed/${id}`}
          title={title}
          className="absolute left-0 top-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
}
