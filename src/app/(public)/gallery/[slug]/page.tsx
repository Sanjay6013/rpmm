import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { getImageUrl } from "@/lib/blob-url";

export default async function AlbumDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [album, settings] = await Promise.all([
    prisma.galleryAlbum.findUnique({
      where: { slug },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  if (!album || !album.isPublished) notFound();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-lg hover:bg-muted hover:text-foreground h-8 px-2.5 text-sm font-medium transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {settings?.backToGalleryLabel ?? "Back to Gallery"}
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">{album.title}</h1>
          {album.description && (
            <p className="text-muted-foreground mt-2">{album.description}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">{album.images.length} photos</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {album.images.map((image) => (
            <div key={image.id} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
              <Image
                src={getImageUrl(image.url)}
                alt={image.caption ?? album.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
