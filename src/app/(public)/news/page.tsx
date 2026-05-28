import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function NewsPage() {
  const [news, settings] = await Promise.all([
    prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold"><span className="gradient-text">{settings?.newsTitle ?? "News & Updates"}</span></h1>
          <div className="w-24 h-1 gradient-primary rounded-full mx-auto mt-4" />
          <p className="text-muted-foreground mt-3">{settings?.newsSubtitle ?? "Latest news from RPMM"}</p>
        </div>

        {news.length === 0 ? (
          <p className="text-center text-muted-foreground">{settings?.newsEmptyMessage ?? "No news articles available yet."}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group rounded-lg overflow-hidden bg-card gradient-border gradient-card-hover"
              >
                {item.coverImage && (
                  <div className="relative h-48 gradient-top-bar">
                    <Image src={item.coverImage} alt={item.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{formatDate(item.publishedAt)}</p>
                  <h3 className="font-semibold mt-1">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
