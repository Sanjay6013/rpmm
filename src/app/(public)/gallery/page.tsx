import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { GALLERY_CATEGORIES } from "@/lib/constants";

export default async function GalleryPage() {
  const [albums, settings] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where: { isPublished: true },
      include: {
        images: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold"><span className="gradient-text">{settings?.galleryTitle ?? "Photo Gallery"}</span></h1>
          <div className="w-24 h-1 gradient-primary rounded-full mx-auto mt-4" />
          <p className="text-muted-foreground mt-3">{settings?.gallerySubtitle ?? "Explore our school life through photos"}</p>
        </div>

        {albums.length === 0 ? (
          <p className="text-center text-muted-foreground">{settings?.galleryEmptyMessage ?? "No albums available yet."}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug}`}
                className="group rounded-lg overflow-hidden bg-card gradient-border gradient-card-hover"
              >
                {album.images[0] && (
                  <div className="relative h-56">
                    <Image
                      src={(album.images as { url: string }[] & { id: string }[])[0]?.url ?? "/images/placeholder.jpg"}
                      alt={album.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge variant="secondary">{album.images.length} photos</Badge>
                    </div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold">{album.title}</h3>
                  {album.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  <Badge variant="outline" className="mt-2">
                    {GALLERY_CATEGORIES.find((c) => c.value === album.category)?.label ?? album.category}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
