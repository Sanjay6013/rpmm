import prisma from "@/lib/prisma";
import { ContactForm } from "@/components/public/contact-form";
import { MapEmbed } from "@/components/public/map-embed";

export default async function ContactPage() {
  const [settings, formContent] = await Promise.all([
    prisma.siteSettings.findUnique({
      where: { id: "default" },
    }),
    prisma.contactFormContent.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Contact <span className="gradient-text">Us</span></h1>
          <div className="w-24 h-1 gradient-primary rounded-full mx-auto mt-4" />
          <p className="text-muted-foreground mt-3">{settings?.contactSubtitle ?? "We'd love to hear from you"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm content={formContent} />
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="gradient-border p-6 space-y-4 bg-card rounded-lg">
              <h3 className="font-semibold text-lg gradient-text">{settings?.getInTouchHeading ?? "Get in Touch"}</h3>
              {settings?.address && (
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{settings.address}</p>
                </div>
              )}
              {settings?.phone && (
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{settings.phone}</p>
                </div>
              )}
              {settings?.email && (
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{settings.email}</p>
                </div>
              )}
              {settings?.officeHours && (
                <div>
                  <p className="text-sm font-medium">Office Hours</p>
                  <p className="text-sm text-muted-foreground">{settings.officeHours}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        {settings?.mapEmbedUrl && (
          <div className="mt-12 max-w-6xl mx-auto">
            <MapEmbed url={settings.mapEmbedUrl} title={settings?.mapTitle ?? "School Location"} />
          </div>
        )}
      </div>
    </div>
  );
}
