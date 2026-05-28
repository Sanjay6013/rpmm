import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/blob-url";
import { GraduationCap, BookOpen, Trophy, Palette, Cpu, ArrowRight, TrendingUp, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  BookOpen,
  Trophy,
  Palette,
  Cpu,
  Users,
  Award,
  TrendingUp,
};

export default async function HomePage() {
  const [homeContent, heroSlides, settings, events, news, announcements] =
    await Promise.all([
      prisma.homeContent.findUnique({ where: { id: "default" } }),
      prisma.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.siteSettings.findUnique({ where: { id: "default" } }),
      prisma.event.findMany({
        where: { isPublished: true, startDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
        take: 3,
      }),
      prisma.news.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
      prisma.announcement.findMany({
        where: { isActive: true, startDate: { lte: new Date() } },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const stats: { label: string; value: string; icon?: string }[] =
    (homeContent?.stats as []) ?? [];
  const highlights: { title: string; description: string; icon?: string }[] =
    (homeContent?.highlights as []) ?? [];
  const activeAnnouncement = announcements[0];

  return (
    <>
      {/* Announcement Banner */}
      {activeAnnouncement && (
        <div className="gradient-primary py-2 text-center text-sm text-white font-medium">
          <p>{activeAnnouncement.title}: {activeAnnouncement.content}</p>
        </div>
      )}

      {/* Hero Section */}
      {heroSlides.length > 0 && heroSlides[0].imageUrl && (
        <section className="relative h-[500px] md:h-[600px] overflow-hidden">
          <Image
            src={getImageUrl(heroSlides[0].imageUrl)}
            alt={heroSlides[0].title}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-indigo-900/70 to-purple-900/70" />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <div className="max-w-3xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                {heroSlides[0].title}
              </h1>
              {heroSlides[0].subtitle && (
                <p className="text-xl md:text-2xl mb-8 text-white/90 drop-shadow">
                  {heroSlides[0].subtitle}
                </p>
              )}
              {heroSlides[0].ctaText && (
                <Link
                  href={heroSlides[0].ctaUrl ?? "/contact"}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-blue-700 hover:bg-blue-50 h-12 px-8 text-base font-semibold transition-colors shadow-lg"
                >
                  {heroSlides[0].ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      {stats.length > 0 && (
        <section className="gradient-primary py-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
              {stats.map((stat, i) => {
                const Icon = stat.icon ? iconMap[stat.icon] : null;
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    {Icon && <Icon className="h-8 w-8 text-white/80" />}
                    <span className="text-3xl md:text-4xl font-bold">{stat.value}</span>
                    <span className="text-sm text-white/80">{stat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Highlights Grid */}
      {highlights.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-2">{homeContent?.highlightsTitle ?? "Why Choose RPMM?"}</h2>
            <p className="text-center text-muted-foreground mb-12">{homeContent?.highlightsSubtitle ?? "Discover what makes us exceptional"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {highlights.map((item, i) => {
                const Icon = item.icon ? iconMap[item.icon] : null;
                return (
                  <div key={i} className="gradient-border gradient-card-hover p-6 text-center">
                    {Icon && (
                      <div className="flex justify-center mb-4">
                        <div className="gradient-primary rounded-xl p-3 shadow-md">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Upcoming Events</h2>
                <p className="text-muted-foreground mt-1">{homeContent?.upcomingEventsSubtitle ?? "Stay updated with our latest events"}</p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary/5 h-9 px-4 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <div key={event.id} className="gradient-border gradient-card-hover overflow-hidden rounded-lg bg-card">
                  {event.coverImage && (
                    <div className="relative h-48 gradient-top-bar">
                      <Image src={getImageUrl(event.coverImage)} alt={event.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-sm font-semibold gradient-text">{formatDate(event.startDate)}</p>
                    <h3 className="font-semibold mt-1">{event.title}</h3>
                    {event.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.excerpt}</p>
                    )}
                    <Link
                      href={`/events/${event.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 mt-2"
                    >
                      Learn More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest News */}
      {news.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Latest News</h2>
                <p className="text-muted-foreground mt-1">{homeContent?.latestNewsSubtitle ?? "News and updates from RPMM"}</p>
              </div>
              <Link
                href="/news"
                className="inline-flex items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary/5 h-9 px-4 text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item) => (
                <div key={item.id} className="gradient-border gradient-card-hover overflow-hidden rounded-lg bg-card">
                  {item.coverImage && (
                    <div className="relative h-48 gradient-top-bar">
                      <Image src={getImageUrl(item.coverImage)} alt={item.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{formatDate(item.publishedAt)}</p>
                    <h3 className="font-semibold mt-1">{item.title}</h3>
                    {item.excerpt && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.excerpt}</p>
                    )}
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 mt-2"
                    >
                      Read More <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="gradient-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {homeContent?.ctaTitle ?? "Begin Your Journey at RPMM"}
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
            {homeContent?.ctaDescription}
          </p>
          <Link
            href={homeContent?.ctaButtonUrl ?? "/contact"}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-blue-700 hover:bg-blue-50 h-12 px-8 text-base font-semibold transition-colors shadow-lg"
          >
            {homeContent?.ctaButtonText ?? "Apply Now"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
