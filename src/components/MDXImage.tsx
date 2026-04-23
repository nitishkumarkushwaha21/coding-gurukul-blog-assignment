import Image from "next/image";

interface MDXImageProps {
  src?: string;
  alt?: string;
}

export function MDXImage({ src = "", alt = "" }: MDXImageProps) {
  if (!src) {
    return null;
  }

  const [altText, caption] = alt.split("|").map((item) => item.trim());

  return (
    <span className="my-8 block space-y-2">
      <Image
        src={src}
        alt={altText || "Article image"}
        width={1200}
        height={700}
        className="w-full rounded-lg border border-slate-200 object-cover"
      />
      {caption ? (
        <span className="mt-2 block text-center text-sm text-slate-500">
          {caption}
        </span>
      ) : null}
    </span>
  );
}
