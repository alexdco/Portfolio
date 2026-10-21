import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { defineQuery } from "next-sanity";
import { BlogPortableText } from "@/components/BlogPortableText";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const BLOG_POST_QUERY =
  defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
  title,
  excerpt,
  content,
  category,
  tags,
  publishedAt,
  readTime,
  featuredImage
}`);

const BLOG_SLUGS_QUERY = defineQuery(
  `*[_type == "blog" && defined(slug.current)].slug.current`,
);

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { data: slugs } = await sanityFetch({
    query: BLOG_SLUGS_QUERY,
    perspective: "published",
    stega: false,
  });
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug },
    stega: false,
  });
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: { slug },
  });

  if (!post) notFound();

  return (
    <main className="min-h-screen py-20 px-6">
      <article className="container mx-auto max-w-3xl">
        <Link
          href="/#blog"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-10"
        >
          ← Back to all posts
        </Link>

        <header className="mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {post.category && (
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                {post.category}
              </span>
            )}
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-brand">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-md bg-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.featuredImage && (
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted mb-10">
            <Image
              src={urlFor(post.featuredImage).width(1200).height(675).url()}
              alt={post.featuredImage.alt || post.title || "Blog post"}
              fill
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        {post.content && post.content.length > 0 ? (
          <BlogPortableText value={post.content} />
        ) : (
          <p className="text-muted-foreground italic">
            This article has no content yet.
          </p>
        )}
      </article>
    </main>
  );
}
