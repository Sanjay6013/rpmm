import Image from "next/image";
import prisma from "@/lib/prisma";
import { getImageUrl } from "@/lib/blob-url";

export default async function AboutPage() {
  const [about, settings] = await Promise.all([
    prisma.aboutContent.findUnique({ where: { id: "default" } }),
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
  ]);

  const infrastructure: { title: string; description: string; imageUrl?: string }[] =
    (about?.infrastructure as []) ?? [];
  const values: { title: string; description: string }[] =
    (about?.values as []) ?? [];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Page Header with gradient accent */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            About <span className="gradient-text">{settings?.schoolName ?? "RPMM"}</span>
          </h1>
          <div className="w-24 h-1 gradient-primary rounded-full mx-auto mt-4" />
          <p className="text-muted-foreground mt-3">{settings?.tagline}</p>
        </div>

        {/* History */}
        {about?.history && (
          <section className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">{about?.historyLabel ?? "Our History"}</h2>
            <div className="gradient-border p-6 md:p-8 rounded-lg bg-card">
              <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: about.history }}
              />
            </div>
          </section>
        )}

        {/* Mission & Vision */}
        <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {about?.mission && (
            <div className="gradient-border p-8 text-center bg-card rounded-lg gradient-card-hover">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{about?.missionLabel ?? "Our Mission"}</h3>
              <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: about.mission }}
              />
            </div>
          )}
          {about?.vision && (
            <div className="gradient-border p-8 text-center bg-card rounded-lg gradient-card-hover">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-xl font-bold">V</span>
              </div>
              <h3 className="text-xl font-bold mb-4">{about?.visionLabel ?? "Our Vision"}</h3>
              <div
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: about.vision }}
              />
            </div>
          )}
        </section>

        {/* Principal's Message */}
        {about?.principalName && (
          <section className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">{about?.principalHeading ?? "Principal's Message"}</h2>
            <div className="gradient-border p-6 md:p-8 bg-card rounded-lg">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {about?.principalPhoto && (
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0 ring-4 ring-primary/20">
                    <Image
                      src={getImageUrl(about.principalPhoto)}
                      alt={about.principalName}
                      fill
                      sizes="192px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{about.principalName}</h3>
                  <p className="text-sm gradient-text font-medium mb-4">{about?.principalTitle ?? "Principal"}</p>
                  {about.principalMessage && (
                    <div
                      className="prose prose-neutral dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: about.principalMessage }}
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Infrastructure */}
        {infrastructure.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-2 text-center">{about?.infrastructureTitle ?? "Our Infrastructure"}</h2>
            <div className="w-24 h-1 gradient-primary rounded-full mx-auto mt-2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {infrastructure.map((item, i) => (
                <div key={i} className="gradient-border overflow-hidden bg-card rounded-lg gradient-card-hover">
                  {item.imageUrl && (
                    <div className="relative h-48 gradient-top-bar">
                      <Image src={getImageUrl(item.imageUrl)} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Values */}
        {values.length > 0 && (
          <section className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-center">{about?.valuesTitle ?? "Our Values"}</h2>
            <div className="w-24 h-1 gradient-primary rounded-full mx-auto mt-2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((item, i) => (
                <div key={i} className="gradient-border p-6 bg-card rounded-lg gradient-card-hover">
                  <div className="flex items-start gap-3">
                    <div className="gradient-primary rounded-lg w-8 h-8 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
