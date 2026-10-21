import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { BLOG_POST_QUERYResult } from "@/sanity.types";

type BlogContent = NonNullable<NonNullable<BLOG_POST_QUERYResult>["content"]>;

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7 mb-6">{children}</p>,
    h1: ({ children }) => (
      <h2 className="text-3xl font-bold mt-12 mb-4">{children}</h2>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-10 mb-4">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand pl-4 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-4 hover:opacity-80"
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || ""}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-contain"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

export function BlogPortableText({ value }: { value: BlogContent }) {
  return <PortableText value={value} components={components} />;
}
