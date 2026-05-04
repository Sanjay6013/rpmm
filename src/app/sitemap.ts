import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const [events, news, albums] = await Promise.all([
    prisma.event.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.news.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.galleryAlbum.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/gallery`, lastModified: new Date() },
    { url: `${baseUrl}/events`, lastModified: new Date() },
    { url: `${baseUrl}/news`, lastModified: new Date() },
  ];

  const eventPages = events.map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: e.updatedAt,
  }));

  const newsPages = news.map((n) => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: n.updatedAt,
  }));

  const albumPages = albums.map((a) => ({
    url: `${baseUrl}/gallery/${a.slug}`,
    lastModified: a.updatedAt,
  }));

  return [...staticPages, ...eventPages, ...newsPages, ...albumPages];
}
