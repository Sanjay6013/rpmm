import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function EventsPage() {
  const [events, settings] = await Promise.all([
    prisma.event.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "desc" },
    }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startDate) >= now);
  const past = events.filter((e) => new Date(e.startDate) < now);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold"><span className="gradient-text">{settings?.eventsTitle ?? "Events"}</span></h1>
          <div className="w-24 h-1 gradient-primary rounded-full mx-auto mt-4" />
          <p className="text-muted-foreground mt-3">{settings?.eventsSubtitle ?? "Stay updated with school events"}</p>
        </div>

        {/* Upcoming Events */}
        {upcoming.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{settings?.upcomingEventsLabel ?? "Upcoming Events"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcoming.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group rounded-lg overflow-hidden bg-card gradient-border gradient-card-hover"
                >
                  {event.coverImage && (
                    <div className="relative h-48 gradient-top-bar">
                      <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold gradient-text">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.startDate)}
                    </div>
                    <h3 className="font-semibold mt-1">{event.title}</h3>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                    {event.excerpt && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{event.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {past.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">{settings?.pastEventsLabel ?? "Past Events"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {past.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group rounded-lg overflow-hidden bg-card gradient-border gradient-card-hover opacity-80"
                >
                  {event.coverImage && (
                    <div className="relative h-48 gradient-top-bar">
                      <Image src={event.coverImage} alt={event.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.startDate)}
                    </div>
                    <h3 className="font-semibold mt-1">{event.title}</h3>
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {events.length === 0 && (
          <p className="text-center text-muted-foreground">{settings?.eventsEmptyMessage ?? "No events available yet."}</p>
        )}
      </div>
    </div>
  );
}
