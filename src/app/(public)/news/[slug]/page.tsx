import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [news, settings] = await Promise.all([
    prisma.news.findUnique({ where: { slug } }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  if (!news || !news.isPublished) notFound();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 rounded-lg hover:bg-muted hover:text-foreground h-8 px-2.5 text-sm font-medium transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {settings?.backToNewsLabel ?? "Back to News"}
        </Link>

        {news.coverImage && (
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
            <Image src={news.coverImage} alt={news.title} fill className="object-cover" />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(news.publishedAt)}
          </div>
          {news.author && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {news.author}
            </div>
          )}
        </div>

        {news.content && (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />
        )}
      </div>
    </div>
  );
}
