import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [event, settings] = await Promise.all([
    prisma.event.findUnique({ where: { slug } }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  if (!event || !event.isPublished) notFound();

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 rounded-lg hover:bg-muted hover:text-foreground h-8 px-2.5 text-sm font-medium transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {settings?.backToEventsLabel ?? "Back to Events"}
        </Link>

        {event.coverImage && (
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
            <Image src={event.coverImage} alt={event.title} fill sizes="100vw" className="object-cover" />
          </div>
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(event.startDate)}
            {event.endDate && ` - ${formatDate(event.endDate)}`}
          </div>
          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {event.location}
            </div>
          )}
        </div>

        {event.content && (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: event.content }}
          />
        )}
      </div>
    </div>
  );
}
